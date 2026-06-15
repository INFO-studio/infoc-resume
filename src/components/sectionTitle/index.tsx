import type { FC } from 'react';

export type SectionTitleProps = {
  title: string;
};

const SectionTitle: FC<SectionTitleProps> = ({ title }) => {
  return (
    <div className={'flex items-center gap-2'}>
      <div className={'flex-1 h-4px bg-n4 rounded-full'} />
      <div className={'truncate font-bold'}>{title}</div>
      <div className={'flex-1 h-4px bg-n4 rounded-full'} />
    </div>
  );
};

export default SectionTitle;
