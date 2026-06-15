/** biome-ignore-all lint/suspicious/noArrayIndexKey: partial */
import type { FC } from 'react';
import { SectionContent, SectionItem, SectionTitle } from '@/components';
import type { ResumeConfigContentItem, ResumeConfigContentItemFull } from '@/utils';

export type ContentSectionProps = {
  section: ResumeConfigContentItem;
};

const ContentSection: FC<ContentSectionProps> = ({ section }) => {
  const sectionFull = section as ResumeConfigContentItemFull;

  return (
    <div>
      <SectionTitle title={section.sectionTitle} />
      {sectionFull.content ? (
        <SectionContent content={sectionFull.content} />
      ) : (
        <div className={'flex flex-col gap-1'}>
          {sectionFull.itemList?.map((item, index) => (
            <SectionItem item={item} key={`${item.title}_${index}`} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ContentSection;
