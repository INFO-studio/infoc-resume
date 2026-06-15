import type { FC, ReactNode } from 'react';
import { Icon } from '@/components';

export type LinkProps = {
  content?: ReactNode;
  suffixIcon?: ReactNode;
  href: string;
};

const Link: FC<LinkProps> = ({ content, suffixIcon, href }) => {
  return (
    <a href={href} className={'inline-flex decoration-none items-center gap-1 text-prfg'}>
      {content}
      {suffixIcon ?? <Icon name={'lucide-square-arrow-out-up-right'} />}
    </a>
  );
};

export default Link;
