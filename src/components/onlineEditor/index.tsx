import { AlertCircle, CheckCircle2, Download, Pencil, RotateCcw } from 'lucide-react';
import { type FC, useCallback, useMemo, useState } from 'react';
import { Sheet } from '@/components';
import CodeEditor from '@/components/codeEditor';
import { useResumeConfig } from '@/contexts/resumeConfigContext';

export type OnlineEditorButtonProps = {
  className?: string;
};

const btnBase =
  'border-0 rounded-1 w-24 h-6 transition-colors cursor-pointer inline-flex items-center justify-center gap-1 text-xs font-medium';

export const OnlineEditorButton: FC<OnlineEditorButtonProps> = ({ className }) => {
  const [open, setOpen] = useState(false);
  const { source, setSource, parseError, isCustom, resetDefault, exportConfig } = useResumeConfig();

  const status = useMemo(() => {
    if (parseError) return { tone: 'error' as const, text: parseError };
    if (isCustom) return { tone: 'ok' as const, text: '已启用本地自定义配置' };
    return { tone: 'ok' as const, text: '当前为默认配置，开始自由修改 👇' };
  }, [parseError, isCustom]);

  const handleReset = useCallback(() => {
    if (!isCustom && !parseError) return;
    if (window.confirm('确定恢复为默认配置？当前 localStorage 中的改动会被清空。')) {
      resetDefault();
    }
  }, [isCustom, parseError, resetDefault]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`${btnBase} bg-primary-bg text-primary-fg hover:brightness-95 ${className ?? ''}`}
      >
        <Pencil size={14} strokeWidth={2.2} />
        <span>在线编辑</span>
      </button>

      <Sheet
        open={open}
        onOpenChange={setOpen}
        title={
          <span className="flex items-center gap-2">
            <Pencil size={16} />
            在线编辑配置
          </span>
        }
        description="编辑右侧 TypeScript 源码，左侧简历会实时刷新；自动保存到浏览器 localStorage，刷新不丢失。"
      >
        <div className="h-full flex flex-col gap-3 p-4">
          {/* 操作栏 */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <div
              className={
                'flex-1 min-w-0 inline-flex items-center gap-2 rounded-1 border px-3 py-1.5 text-xs truncate ' +
                (status.tone === 'error'
                  ? 'bg-red-50 text-red-600 border-red-200'
                  : 'bg-green-50 text-emerald-700 border-emerald-200')
              }
              title={status.text}
            >
              {status.tone === 'error' ? (
                <AlertCircle size={14} className="shrink-0" />
              ) : (
                <CheckCircle2 size={14} className="shrink-0" />
              )}
              <span className="truncate">
                {status.tone === 'error' ? `解析失败: ${status.text}` : status.text}
              </span>
            </div>

            <button
              type="button"
              onClick={handleReset}
              disabled={!isCustom && !parseError}
              className={`${btnBase} h-8 w-auto px-3 ${
                isCustom || parseError
                  ? 'bg-neutral-4 text-neutral-2 hover:bg-neutral-3'
                  : 'bg-neutral-4/60 text-neutral-3 cursor-not-allowed'
              }`}
            >
              <RotateCcw size={14} />
              <span>恢复默认</span>
            </button>

            <button
              type="button"
              onClick={exportConfig}
              className={`${btnBase} h-8 w-auto px-3 bg-primary-bg text-primary-fg hover:brightness-95`}
            >
              <Download size={14} />
              <span>导出 .ts</span>
            </button>
          </div>

          {/* 编辑器 */}
          <div
            className={
              'flex-1 min-h-0 rounded-2 border overflow-hidden ' +
              (status.tone === 'error' ? 'border-red-300' : 'border-neutral-3')
            }
          >
            <CodeEditor
              language="typescript"
              value={source}
              onChange={setSource}
              placeholder="在这里写 defineConfig({ ... })"
            />
          </div>

          <div className="shrink-0 text-[11px] text-neutral-3 leading-relaxed px-1">
            小提示：支持 <code className="rounded-sm bg-code-bg px-1">Ctrl/Cmd + S</code> 历史回溯、
            <code className="rounded-sm bg-code-bg px-1">Tab</code> 缩进对齐、
            <code className="rounded-sm bg-code-bg px-1">Ctrl/Cmd + /</code> 注释等常用快捷键；
            语法高亮 +
            基础补全已开启，类型提示为纯浏览器端难以完整支持，若写错会在顶部看到红色错误。
          </div>
        </div>
      </Sheet>
    </>
  );
};

export default OnlineEditorButton;
