import { AlertCircle, CheckCircle2, ChevronRight, Code2, Download, RotateCcw } from 'lucide-react';
import { type FC, type ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import type { CodeEditorProps } from '@/components/codeEditor';
import CodeEditor from '@/components/codeEditor';
import { useResumeConfig } from '@/contexts/resumeConfigContext';

export type OnlineEditorPanelProps = {
  preview: ReactNode;
  defaultSplitRatio?: number;
  defaultOpen?: boolean;
};

const btnBase =
  'inline-flex items-center justify-center gap-1.5 border-0 rounded-1 px-3 h-8 cursor-pointer transition-colors text-xs font-medium select-none';

export const OnlineEditorPanel: FC<OnlineEditorPanelProps> = ({
  preview,
  defaultSplitRatio = 0.56,
  defaultOpen = true,
}) => {
  const { source, setSource, parseError, isCustom, resetDefault, exportConfig } = useResumeConfig();
  const [editorOpen, setEditorOpen] = useState<boolean>(() => {
    if (typeof window === 'undefined') return defaultOpen;
    try {
      const saved = window.localStorage.getItem('infoc-resume:editor-open');
      return saved ? saved === '1' : defaultOpen;
    } catch {
      return defaultOpen;
    }
  });
  const [splitRatio, setSplitRatio] = useState<number>(() => {
    if (typeof window === 'undefined') return defaultSplitRatio;
    try {
      const saved = Number(window.localStorage.getItem('infoc-resume:split-ratio'));
      if (Number.isFinite(saved) && saved > 0.1 && saved < 0.9) return saved;
    } catch {
      /* noop */
    }
    return defaultSplitRatio;
  });

  useEffect(() => {
    try {
      window.localStorage.setItem('infoc-resume:editor-open', editorOpen ? '1' : '0');
    } catch {
      /* noop */
    }
  }, [editorOpen]);

  useEffect(() => {
    try {
      window.localStorage.setItem('infoc-resume:split-ratio', String(splitRatio));
    } catch {
      /* noop */
    }
  }, [splitRatio]);

  const status = useMemo(() => {
    if (parseError) return { tone: 'error' as const, text: parseError };
    if (isCustom) return { tone: 'ok' as const, text: '实时生效 · 自定义配置已保存到本地' };
    return { tone: 'ok' as const, text: '当前为默认配置，开始自由编辑 👇' };
  }, [parseError, isCustom]);

  const handleReset = useCallback(() => {
    if (!isCustom && !parseError) return;
    if (window.confirm('确定恢复为默认配置？当前 localStorage 中的改动会被清空。')) {
      resetDefault();
    }
  }, [isCustom, parseError, resetDefault]);

  // 拖拽分隔条
  const onDraggerMouseDown: React.MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      e.preventDefault();
      const startX = e.clientX;
      const startRatio = splitRatio;
      const container = (e.currentTarget.parentElement ?? document.body) as HTMLElement;
      const totalWidth = container.getBoundingClientRect().width;
      if (totalWidth <= 0) return;

      const onMove = (ev: MouseEvent) => {
        const delta = ev.clientX - startX;
        const next = Math.max(0.2, Math.min(0.82, startRatio + delta / totalWidth));
        setSplitRatio(next);
      };
      const onUp = () => {
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);
      };
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
    },
    [splitRatio],
  );

  const previewPct = splitRatio * 100;
  const editorPct = 100 - previewPct;
  const language: CodeEditorProps['language'] = 'typescript';

  return (
    <div className="w-full flex flex-col items-stretch gap-3 shrink-0">
      {/* 顶部工具栏：开关按钮 */}
      <div className="w-full flex justify-end">
        <button
          type="button"
          onClick={() => setEditorOpen((v) => !v)}
          className={
            btnBase +
            ` ${editorOpen ? 'bg-primary-bg text-primary-fg shadow-sm' : 'bg-neutral-4 text-neutral-2 hover:bg-neutral-3'}`
          }
          aria-pressed={editorOpen}
          title={editorOpen ? '收起配置编辑器' : '展开配置编辑器'}
        >
          <Code2 size={14} />
          <span>{editorOpen ? '收起编辑器' : '在线编辑'}</span>
        </button>
      </div>

      {/* 主体：左预览 / 右编辑（或单独预览） */}
      <div
        className={
          'w-full flex items-stretch gap-0 rounded-3 border border-neutral-4 bg-neutral-4/30 p-2 shadow-sm ' +
          (editorOpen ? '' : 'flex-col')
        }
      >
        {/* 预览区 */}
        <section
          className={
            'flex items-start justify-center py-4 px-3 min-w-0 bg-[#9a9a9a] rounded-2 overflow-auto transition-all duration-300 ease-out relative ' +
            (editorOpen ? '' : 'min-h-[90vh]')
          }
          style={editorOpen ? { width: `${previewPct}%` } : undefined}
        >
          {preview}
        </section>

        {/* 分隔条 */}
        {editorOpen ? (
          <div
            role="separator"
            aria-orientation="vertical"
            aria-valuenow={Math.round((1 - splitRatio) * 100)}
            aria-valuemin={18}
            aria-valuemax={80}
            onMouseDown={onDraggerMouseDown}
            className="relative w-2 mx-0.5 shrink-0 cursor-col-resize group"
            tabIndex={-1}
            title="左右拖拽调整预览/编辑器比例"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-16 w-1.5 rounded-full bg-neutral-3 group-hover:bg-primary-fg/50 transition-colors" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-neutral-4 group-hover:text-primary-fg pointer-events-none">
              <ChevronRight size={11} />
              <ChevronRight size={11} className="-mt-1" />
            </div>
          </div>
        ) : null}

        {/* 编辑区 */}
        {editorOpen ? (
          <aside
            className={
              'flex flex-col min-h-0 rounded-2 bg-neutral-5 border border-neutral-3 shadow-md overflow-hidden transition-all duration-300 ease-out'
            }
            style={{ width: `${editorPct}%` }}
          >
            {/* Header */}
            <header className="shrink-0 px-4 py-3 border-b border-neutral-4 flex flex-wrap items-center gap-2 bg-neutral-5">
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className={
                    'h-7 w-7 rounded-1 inline-flex items-center justify-center ' +
                    (status.tone === 'error'
                      ? 'bg-red-50 text-red-600'
                      : 'bg-emerald-50 text-emerald-700')
                  }
                >
                  {status.tone === 'error' ? <AlertCircle size={14} /> : <CheckCircle2 size={14} />}
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="text-sm font-bold text-neutral-1 flex items-center gap-1.5">
                    <Code2 size={14} />
                    <span>配置编辑器</span>
                    <span className="text-neutral-3 font-normal text-[11px]">
                      · TypeScript · 实时预览
                    </span>
                  </div>
                  <div
                    className={
                      'text-[11px] truncate max-w-[420px] ' +
                      (status.tone === 'error' ? 'text-red-600' : 'text-neutral-3')
                    }
                    title={status.text}
                  >
                    {status.tone === 'error' ? `解析失败：${status.text}` : status.text}
                  </div>
                </div>
              </div>

              <div className="flex-1" />

              <button
                type="button"
                onClick={handleReset}
                disabled={!isCustom && !parseError}
                className={`${btnBase} ${
                  isCustom || parseError
                    ? 'bg-neutral-4 text-neutral-2 hover:bg-neutral-3'
                    : 'bg-neutral-4/60 text-neutral-3 cursor-not-allowed'
                }`}
              >
                <RotateCcw size={13} />
                <span>恢复默认</span>
              </button>

              <button
                type="button"
                onClick={exportConfig}
                className={`${btnBase} bg-primary-bg text-primary-fg hover:brightness-95 shadow-sm`}
              >
                <Download size={13} />
                <span>导出 .ts</span>
              </button>
            </header>

            {/* Editor */}
            <div
              className={
                'flex-1 min-h-0 bg-neutral-5 ' +
                (status.tone === 'error'
                  ? 'border-r-[3px] border-red-300'
                  : 'border-r-[3px] border-transparent')
              }
            >
              <CodeEditor
                language={language}
                value={source}
                onChange={setSource}
                placeholder="export default defineConfig({ ... })  ——  在这里编辑配置，左侧立即刷新"
              />
            </div>

            {/* Footer */}
            <footer className="shrink-0 px-4 py-2 border-t border-neutral-4 bg-neutral-4/50 text-[11px] text-neutral-3 leading-relaxed flex flex-wrap items-center gap-x-3 gap-y-1">
              <span>
                快捷键：<code className="rounded-sm bg-code-bg px-1">Ctrl/Cmd+Z</code> 撤销 ·{' '}
                <code className="rounded-sm bg-code-bg px-1">Ctrl/Cmd+Y</code> 重做 ·{' '}
                <code className="rounded-sm bg-code-bg px-1">Tab</code> 缩进 ·{' '}
                <code className="rounded-sm bg-code-bg px-1">Ctrl/Cmd+/</code> 注释
              </span>
              <span className="ml-auto">
                自动持久化到 <code className="rounded-sm bg-code-bg px-1">localStorage</code>
                ，刷新不丢失；「恢复默认」清空本地。
              </span>
            </footer>
          </aside>
        ) : null}
      </div>
    </div>
  );
};

export default OnlineEditorPanel;
