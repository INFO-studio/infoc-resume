import type { FC } from 'react';

export type TagProps = {
  content: string;
};

const Tag: FC<TagProps> = ({ content }) => {
  return (
    <div className={'inline-flex text-primary-fg text-xs justify-center items-center'}>
      <div className={'px-1 py-.25 bg-primary-bg rounded-1'}>{content}</div>
    </div>
  );
};

export default Tag;
