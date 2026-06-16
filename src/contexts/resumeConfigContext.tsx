import {
  createContext,
  type FC,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { transform } from 'sucrase';
import rawDefaultSrc from '@/config?raw';
import defineConfigFn, { ConfigDefault, type ResumeConfig } from '@/utils/defineConfig';

export type EvaluatedConfig = ReturnType<typeof defineConfigFn>;

type Ctx = {
  source: string;
  setSource: (next: string) => void;
  config: EvaluatedConfig;
  parseError: string | null;
  isCustom: boolean;
  resetDefault: () => void;
  exportConfig: () => void;
};

const STORAGE_KEY = 'infoc-resume:config-source:v1';

const stripImports = (src: string) =>
  src.replace(
    /^\s*import\s+(?:type\s+)?(?:{[\s\S]*?}|[^;'"`\n]+)\s+from\s+['"`][^'"`\n]+['"`]\s*;?/gm,
    '',
  );

/**
 * 从编译后的代码里取出 default 导出作为表达式。
 * - sucrase 的 imports transform 默认会输出 CommonJS：
 *     "use strict"; Object.defineProperty(exports, "__esModule", ...); exports.default = ...
 * - 兜底：如果源码仍然是 ESM，支持 `export default ...`。
 */
const extractDefaultExpr = (jsCode: string): string => {
  // 去掉文件开头的 "use strict" / __esModule 等前置语句（不包含 default 赋值的行）
  const cjsRe = /exports(?:\s*\.\s*)?default\s*=\s*([\s\S]+)$/;
  const m1 = jsCode.match(cjsRe);
  if (m1?.[1]) {
    return m1[1].replace(/;+\s*$/, '').trim();
  }
  return jsCode
    .replace(/^\s*export\s+default\s+/m, '')
    .replace(/;+\s*$/, '')
    .trim();
};

const tryEval = (src: string): { ok: true; value: ResumeConfig } | { ok: false; error: string } => {
  try {
    const noImports = stripImports(src);
    const js = transform(noImports, {
      transforms: ['typescript', 'imports'],
      disableESTransforms: true,
      jsxRuntime: 'preserve',
    }).code;

    const expr = extractDefaultExpr(js);
    if (!expr) {
      return {
        ok: false,
        error: '无法解析默认导出，请保留 `export default defineConfig({ ... })` 写法',
      };
    }

    // 沙箱执行：defineConfig / ConfigDefault 作为参数注入
    // eslint-disable-next-line no-new-func, @typescript-eslint/no-implied-eval
    const fn = new Function('defineConfig', 'ConfigDefault', `"use strict"; return (${expr});`) as (
      defineConfig: typeof defineConfigFn,
      configDefault: typeof ConfigDefault,
    ) => ResumeConfig;

    const userConfig = fn(defineConfigFn, ConfigDefault);
    return { ok: true, value: userConfig };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
};

const ResumeConfigContext = createContext<Ctx | null>(null);

export const ResumeConfigProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [source, setSourceState] = useState<string>(() => {
    if (typeof window === 'undefined') return rawDefaultSrc;
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      return saved ?? rawDefaultSrc;
    } catch {
      return rawDefaultSrc;
    }
  });

  const parsed = useMemo(() => tryEval(source), [source]);
  const userConfig = parsed.ok ? parsed.value : ({} as ResumeConfig);
  const parseError = parsed.ok ? null : parsed.error;
  const config = useMemo<EvaluatedConfig>(() => defineConfigFn(userConfig), [userConfig]);
  const isCustom = source !== rawDefaultSrc;

  const setSource = useCallback((next: string) => setSourceState(next), []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, source);
    } catch {
      /* noop */
    }
  }, [source]);

  const resetDefault = useCallback(() => setSourceState(rawDefaultSrc), []);

  const exportConfig = useCallback(() => {
    try {
      const blob = new Blob([source], { type: 'text/typescript;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      a.href = url;
      a.download = `resume-config-${ts}.ts`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('导出失败', e);
    }
  }, [source]);

  const value = useMemo<Ctx>(
    () => ({ source, setSource, config, parseError, isCustom, resetDefault, exportConfig }),
    [source, setSource, config, parseError, isCustom, resetDefault, exportConfig],
  );

  return <ResumeConfigContext.Provider value={value}>{children}</ResumeConfigContext.Provider>;
};

export const useResumeConfig = () => {
  const ctx = useContext(ResumeConfigContext);
  if (!ctx) throw new Error('useResumeConfig must be used inside <ResumeConfigProvider>');
  return ctx;
};

export { rawDefaultSrc as defaultConfigSource };
