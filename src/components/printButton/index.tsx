import { Popover } from '@base-ui/react/popover';
import type { FC } from 'react';

const PrintButton: FC = () => {
  return (
    <Popover.Root modal={false}>
      <Popover.Trigger
        openOnHover
        delay={200}
        closeDelay={120}
        type="button"
        className={
          'print-button inline-flex items-center justify-center rounded-1 px-3 h-8 ' +
          'cursor-pointer transition-colors text-xs font-medium ' +
          'border border-neutral-3 bg-neutral-4 text-neutral-2 hover:bg-neutral-3'
        }
        onClick={() => window.print()}
      >
        导出 PDF
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner side="bottom" align="end" sideOffset={6}>
          <Popover.Popup
            className={
              'z-[70] w-64 rounded-2 border border-neutral-3 bg-primary-bg color-primary-fg ' +
              'text-xs shadow-md p-3 outline-none origin-top-right ' +
              'transition-[transform,opacity] duration-150 ease-out ' +
              'data-[starting-style]:opacity-0 data-[starting-style]:scale-95 ' +
              'data-[ending-style]:opacity-0 data-[ending-style]:scale-95'
            }
          >
            <Popover.Arrow className="fill-primary-bg stroke-neutral-3" />
            <Popover.Title className="m-0 font-bold text-sm mb-1">导出 PDF 教程</Popover.Title>
            <Popover.Description className="m-0">
              <ol className="list-decimal pl-4 flex flex-col gap-0.5 text-[11px] leading-relaxed">
                <li>点击按钮，调起打印窗口</li>
                <li>打印机选择「另存为 PDF」</li>
                <li>勾选下方的「打印背景」</li>
                <li>点击「保存」按钮即可下载 PDF 文件</li>
              </ol>
            </Popover.Description>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default PrintButton;
