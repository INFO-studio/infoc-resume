import { type FC, type ReactNode, useState } from 'react';

export type PopoverProps = {
  children: ReactNode;
  content: ReactNode;
  placement?: 'bottom' | 'top';
  trigger?: 'hover' | 'click';
};

const Popover: FC<PopoverProps> = ({
  children,
  content,
  placement = 'bottom',
  trigger = 'hover',
}) => {
  const [visible, setVisible] = useState(false);

  const triggerProps =
    trigger === 'hover'
      ? {
          onMouseEnter: () => setVisible(true),
          onMouseLeave: () => setVisible(false),
        }
      : {
          onClick: () => setVisible((v) => !v),
        };

  const handleContentMouseEnter = () => {
    if (trigger === 'hover') setVisible(true);
  };

  const handleContentMouseLeave = () => {
    if (trigger === 'hover') setVisible(false);
  };

  return (
    <div className="relative inline-block" {...triggerProps}>
      {children}
      {visible && (
        <div
          role="tooltip"
          className={`absolute left-1/2 z-10 w-max min-w-40 -translate-x-1/2 rounded-2 bg-prbg border border-n3 color-prfg text-xs shadow-md ${
            placement === 'bottom' ? 'top-full mt-1' : 'bottom-full mb-1'
          }`}
          onMouseEnter={handleContentMouseEnter}
          onMouseLeave={handleContentMouseLeave}
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default Popover;
