import type { FC, ReactNode } from 'react';

export type SectionContentProps = {
  content: ReactNode;
};

const SectionContent: FC<SectionContentProps> = ({ content }) => {
  return <div className={'text-xs px-10'}>{content}</div>;
};

export default SectionContent;
