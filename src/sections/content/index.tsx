/** biome-ignore-all lint/suspicious/noArrayIndexKey: partial */
import type { FC } from 'react';
import { ContentSection } from '@/components';
import config from '@/config';

const Content: FC = () => {
  return (
    <div className={'flex flex-col gap-1'}>
      {config.content.map((contentItem, index) => (
        <ContentSection section={contentItem} key={`${contentItem.sectionTitle}_${index}`} />
      ))}
    </div>
  );
};

export default Content;
