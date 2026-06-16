import { AlertCircle, CheckCircle2, Code2, Download, RotateCcw } from 'lucide-react';
import {
  type FC,
  type ReactNode,
  type TransitionEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { CodeEditorProps } from '@/components/codeEditor';
import CodeEditor from '@/components/codeEditor';
import ConfirmDialog from '@/components/confirmDialog';
import { useResumeConfig } from '@/contexts/resumeConfigContext';

export type OnlineEditorPanelProps = {
  preview: ReactNode;
  actions?: ReactNode;
  defaultSplitRatio?: number;
  defaultOpen?: boolean;
};

const PANEL_MS = 300;

const toolbarBtn =
  'inline-flex items-center justify-center gap-1.5 rounded-1 px-3 h-8 cursor-pointer transition-colors text-xs font-medium select-none border border-neutral-3';

const btnBase =
  'inline-flex items-center justify-center gap-1.5 rounded-1 px-3 h-8 cursor-pointer transition-colors text-xs font-medium select-none border border-neutral-3';

export const OnlineEditorPanel: FC<OnlineEditorPanelProps> = ({
  preview,
  actions,
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
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [isPanelAnimating, setIsPanelAnimating] = useState(false);
  /** 开关动画期间锁定的编辑列目标宽度（px），内容区固定此宽，只动 transform/opacity */
  const [slotWidthPx, setSlotWidthPx] = useState(0);
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

  const bodyRef = useRef<HTMLDivElement>(null);
  const columnRef = useRef<HTMLDivElement>(null);
  const [bodyWidth, setBodyWidth] = useState(0);

  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      setBodyWidth(entries[0]?.contentRect.width ?? 0);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

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
    return { tone: 'ok' as const, text: '当前为默认配置，开始自由编辑' };
  }, [parseError, isCustom]);

  const handleReset = useCallback(() => {
    if (!isCustom && !parseError) return;
    setResetDialogOpen(true);
  }, [isCustom, parseError]);

  const handleResetConfirm = useCallback(() => {
    resetDefault();
  }, [resetDefault]);

  const calcSlotWidth = useCallback(
    (ratio: number, total = bodyWidth) => Math.max(0, total * (1 - ratio) + 9),
    [bodyWidth],
  );

  const editorSlotWidth = calcSlotWidth(splitRatio);
  const previewPct = splitRatio * 100;
  const language: CodeEditorProps['language'] = 'typescript';

  /** 内容层固定宽度：动画中用锁定值，拖动/静止时用实时计算值 */
  const contentWidthPx = isPanelAnimating ? slotWidthPx : editorSlotWidth;
  /** 容器层宽度：开=目标宽，关=0；仅开关动画时 CSS transition */
  const columnWidthPx = editorOpen ? editorSlotWidth : 0;

  const handleToggleEditor = useCallback(() => {
    if (isPanelAnimating) return;
    const total = bodyRef.current?.getBoundingClientRect().width ?? bodyWidth;
    if (total <= 0) {
      setEditorOpen((v) => !v);
      return;
    }
    setSlotWidthPx(calcSlotWidth(splitRatio, total));
    setIsPanelAnimating(true);
    setEditorOpen((v) => !v);
  }, [isPanelAnimating, bodyWidth, splitRatio, calcSlotWidth]);

  const onColumnTransitionEnd = useCallback((e: TransitionEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget || e.propertyName !== 'width') return;
    setIsPanelAnimating(false);
  }, []);

  const onDraggerMouseDown: React.MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      if (isPanelAnimating) return;
      e.preventDefault();
      const startX = e.clientX;
      const startRatio = splitRatio;
      const totalWidth = bodyRef.current?.getBoundingClientRect().width ?? 0;
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
    [splitRatio, isPanelAnimating],
  );

  return (
    <div className="online-editor-panel w-full h-full flex flex-col min-h-0">
      <div className="online-editor-shell w-full flex-1 min-h-0 flex flex-col border border-neutral-4 bg-neutral-4/30 p-2 shadow-sm gap-2">
        <div className="online-editor-toolbar shrink-0 flex justify-end items-center gap-2 px-2 pt-1 pb-0 print:hidden">
          {actions}
          <button
            type="button"
            onClick={handleToggleEditor}
            disabled={isPanelAnimating}
            className={
              toolbarBtn +
              (editorOpen
                ? ' bg-primary-bg text-primary-fg hover:brightness-95 shadow-sm'
                : ' bg-neutral-4 text-neutral-2 hover:bg-neutral-3')
            }
            aria-pressed={editorOpen}
            title={editorOpen ? '收起配置编辑器' : '展开配置编辑器'}
          >
            <Code2 size={14} />
            <span>{editorOpen ? '收起编辑器' : '在线编辑'}</span>
          </button>
        </div>

        <div
          ref={bodyRef}
          className={
            'online-editor-body w-full flex-1 min-h-0 flex flex-row items-stretch gap-0 min-w-0 ' +
            (isPanelAnimating ? 'online-editor-body--animating' : '')
          }
          style={{ ['--panel-ms' as string]: `${PANEL_MS}ms` }}
        >
          <section
            className="online-editor-preview min-w-0 min-h-0 shrink-0 overflow-auto py-4 px-3 bg-[#9a9a9a] rounded-2 online-editor-preview-width"
            style={{ width: editorOpen ? `${previewPct}%` : '100%' }}
          >
            <div className="w-max mx-auto shrink-0">{preview}</div>
          </section>

          <div
            ref={columnRef}
            className="online-editor-column shrink-0 h-full overflow-hidden print:hidden"
            style={{ width: columnWidthPx }}
            aria-hidden={!editorOpen && !isPanelAnimating}
            onTransitionEnd={onColumnTransitionEnd}
          >
            <div
              className={
                'online-editor-slide flex h-full min-h-0 items-stretch ' +
                (editorOpen ? 'online-editor-slide--open' : 'online-editor-slide--closed') +
                (isPanelAnimating ? ' online-editor-slide--animating' : '')
              }
              style={{ width: contentWidthPx }}
            >
              <div
                role="separator"
                aria-orientation="vertical"
                aria-valuenow={Math.round((1 - splitRatio) * 100)}
                aria-valuemin={18}
                aria-valuemax={80}
                onMouseDown={onDraggerMouseDown}
                className={
                  'online-editor-splitter relative w-2 mx-0.5 shrink-0 group ' +
                  (isPanelAnimating || !editorOpen
                    ? 'pointer-events-none cursor-default'
                    : 'cursor-col-resize')
                }
                tabIndex={editorOpen && !isPanelAnimating ? -1 : undefined}
                title="左右拖拽调整预览/编辑器比例"
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-16 w-1.5 rounded-full bg-neutral-3 group-hover:bg-primary-fg/50 transition-colors" />
              </div>

              <aside className="online-editor-aside flex flex-1 flex-col min-h-0 min-w-0 rounded-2 bg-neutral-5 border border-neutral-3 shadow-md overflow-hidden">
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
                      {status.tone === 'error' ? (
                        <AlertCircle size={14} />
                      ) : (
                        <CheckCircle2 size={14} />
                      )}
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

                <footer className="shrink-0 px-4 py-2 border-t border-neutral-4 bg-neutral-4/50 text-[11px] text-neutral-3 leading-relaxed flex flex-col items-start gap-1">
                  <span>
                    快捷键：<code className="rounded-sm bg-code-bg px-1">Ctrl/Cmd+Z</code> 撤销 ·{' '}
                    <code className="rounded-sm bg-code-bg px-1">Ctrl/Cmd+Y</code> 重做 ·{' '}
                    <code className="rounded-sm bg-code-bg px-1">Tab</code> 缩进 ·{' '}
                    <code className="rounded-sm bg-code-bg px-1">Ctrl/Cmd+/</code> 注释
                  </span>
                  <span>
                    自动持久化到 <code className="rounded-sm bg-code-bg px-1">localStorage</code>
                    ，刷新不丢失；「恢复默认」清空本地。
                  </span>
                </footer>
              </aside>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={resetDialogOpen}
        onOpenChange={setResetDialogOpen}
        title="恢复默认配置"
        description="确定恢复为默认配置？当前 localStorage 中的改动会被清空。"
        confirmLabel="恢复默认"
        onConfirm={handleResetConfirm}
        destructive
      />
    </div>
  );
};

export default OnlineEditorPanel;
