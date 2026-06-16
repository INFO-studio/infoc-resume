import { AlertDialog, type AlertDialogBackdropProps } from '@base-ui/react/alert-dialog';
import type { FC, ReactNode } from 'react';

export type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  destructive?: boolean;
};

const ConfirmDialog: FC<ConfirmDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = '确定',
  cancelLabel = '取消',
  onConfirm,
  destructive = false,
}) => {
  const backdropRender: NonNullable<AlertDialogBackdropProps['render']> = (props, state) => (
    <div
      {...props}
      className={`${props.className ?? ''} fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-200 ${
        state.open ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    />
  );

  const confirmCls = destructive
    ? 'bg-red-600 text-white hover:bg-red-700'
    : 'bg-primary-bg text-primary-fg hover:brightness-95';

  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal keepMounted={false}>
        <AlertDialog.Backdrop render={backdropRender} />
        <AlertDialog.Popup
          className={
            'fixed left-1/2 top-1/2 z-[60] w-[min(92vw,400px)] -translate-x-1/2 -translate-y-1/2 ' +
            'rounded-3 border border-neutral-4 bg-neutral-5 shadow-2xl p-5 flex flex-col gap-4 ' +
            'transition-[transform,opacity] duration-200 ease-out ' +
            'data-[state=open]:opacity-100 data-[state=closed]:opacity-0 ' +
            'data-[state=open]:scale-100 data-[state=closed]:scale-95'
          }
        >
          <div className="flex flex-col gap-1.5">
            <AlertDialog.Title className="m-0 text-base font-bold text-neutral-1">
              {title}
            </AlertDialog.Title>
            {description ? (
              <AlertDialog.Description className="m-0 text-sm text-neutral-3 leading-relaxed">
                {description}
              </AlertDialog.Description>
            ) : null}
          </div>

          <div className="flex justify-end items-center gap-2">
            <AlertDialog.Close
              type="button"
              className={
                'inline-flex items-center justify-center border-0 rounded-1 px-3 h-8 cursor-pointer ' +
                'transition-colors text-xs font-medium bg-neutral-4 text-neutral-2 hover:bg-neutral-3'
              }
            >
              {cancelLabel}
            </AlertDialog.Close>
            <button
              type="button"
              className={
                'inline-flex items-center justify-center border-0 rounded-1 px-3 h-8 cursor-pointer ' +
                'transition-colors text-xs font-medium shadow-sm ' +
                confirmCls
              }
              onClick={() => {
                onConfirm();
                onOpenChange(false);
              }}
            >
              {confirmLabel}
            </button>
          </div>
        </AlertDialog.Popup>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};

export default ConfirmDialog;
