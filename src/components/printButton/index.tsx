import type { FC } from 'react';
import { Popover } from '@/components';

const PrintButton: FC = () => {
  return (
    <Popover
      content={
        <div className="p-2 flex flex-col gap-1">
          <div className="font-bold text-sm">导出 PDF 教程</div>
          <ol className="list-decimal pl-4 flex flex-col gap-.5">
            <li>点击按钮，调起打印窗口</li>
            <li>打印机选择「另存为 PDF」</li>
            <li>勾选下方的「打印背景」</li>
            <li>点击「保存」按钮即可下载 PDF 文件</li>
          </ol>
        </div>
      }
    >
      <button
        className={
          'bg-neutral-4 border-0 rounded-1 color-primary-fg w-24 h-6 hover:bg-primary-bg transition-colors cursor-pointer'
        }
        type={'button'}
        onClick={() => window.print()}
      >
        导出 PDF
      </button>
    </Popover>
  );
};

export default PrintButton;
