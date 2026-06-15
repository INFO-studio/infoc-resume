import type { FC } from 'react';

export type TagProps = {
  content: string;
};

const Tag: FC<TagProps> = ({ content }) => {
  return (
    <div className={'inline-flex text-prfg text-xs justify-center items-center'}>
      <div className={'px-1 py-.25 bg-prbg rounded-1'}>{content}</div>
    </div>
  );
};

export default Tag;
