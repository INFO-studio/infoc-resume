import { Dialog, type DialogBackdropProps } from '@base-ui/react/dialog';
import { X } from 'lucide-react';
import type { FC, ReactNode } from 'react';

export type SheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  widthClass?: string;
};

const Sheet: FC<SheetProps> = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  widthClass = 'w-[640px]',
}) => {
  const backdropRender: NonNullable<DialogBackdropProps['render']> = (props, state) => (
    <div
      {...props}
      className={`${props.className ?? ''} fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-200 ${
        state.open ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    />
  );

  const popupCls =
    'fixed right-0 top-0 z-[60] h-screen shadow-2xl bg-neutral-5 border-l border-neutral-4 ' +
    'transition-transform duration-300 ease-out data-[state=open]:translate-x-0 ' +
    'data-[state=closed]:translate-x-full flex flex-col ' +
    widthClass;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal keepMounted={false}>
        <Dialog.Backdrop render={backdropRender} />
        <Dialog.Popup className={popupCls}>
          {title || description ? (
            <div
              className={
                'border-b border-neutral-4 px-5 py-4 flex justify-between items-start gap-3 bg-neutral-5 shrink-0'
              }
            >
              <div className="flex flex-col gap-1 min-w-0">
                {title ? (
                  <Dialog.Title className="m-0 text-base font-bold text-neutral-1 flex items-center gap-2">
                    {title}
                  </Dialog.Title>
                ) : null}
                {description ? (
                  <Dialog.Description className="m-0 text-xs text-neutral-3 leading-relaxed">
                    {description}
                  </Dialog.Description>
                ) : null}
              </div>
              <Dialog.Close
                aria-label="关闭"
                className={
                  'shrink-0 h-8 w-8 inline-flex items-center justify-center rounded-1 border-0 ' +
                  'bg-transparent text-neutral-3 hover:text-neutral-1 hover:bg-neutral-4 ' +
                  'cursor-pointer transition-colors'
                }
                type="button"
              >
                <X size={16} />
              </Dialog.Close>
            </div>
          ) : null}
          <div className={'flex-1 min-h-0 overflow-auto bg-neutral-5'}>{children}</div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default Sheet;
