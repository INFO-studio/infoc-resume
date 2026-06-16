/** biome-ignore-all lint/suspicious/noArrayIndexKey: partial */
import type { FC } from 'react';
import { ContentSection } from '@/components';
import { useResumeConfig } from '@/contexts/resumeConfigContext';

const Content: FC = () => {
  const { config } = useResumeConfig();
  return (
    <div className={'flex flex-col gap-.5'}>
      {config.content.map((contentItem, index) => (
        <ContentSection section={contentItem} key={`${contentItem.sectionTitle}_${index}`} />
      ))}
    </div>
  );
};

export default Content;
