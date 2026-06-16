/** biome-ignore-all lint/suspicious/noArrayIndexKey: partial */
import { type FC, Fragment } from 'react';
import { Icon, Link, Tag } from '@/components';
import { parseIconProps, type ResumeConfigContentItemItemListItem, renderText } from '@/utils';

export type SectionItemProps = {
  item: ResumeConfigContentItemItemListItem;
};

const SectionItem: FC<SectionItemProps> = ({ item }) => {
  const { title, titleIconPrefix, tagList, linkList, contentList, contentStyle = 'list' } = item;
  const titleIconPrefixParsed = parseIconProps(titleIconPrefix);

  return (
    <div className={'px-4 flex flex-col gap-.5'}>
      <div className={'flex justify-between items-center'}>
        <div className={'flex items-center gap-2'}>
          {titleIconPrefixParsed && (
            <Icon name={titleIconPrefixParsed.name} color={titleIconPrefixParsed.color} />
          )}
          <div className={'text-primary-fg text-sm font-bold'}>{title}</div>
        </div>
        <div className={'flex items-center gap-2'}>
          {linkList && (
            <div className={'flex items-center gap-1 text-xs'}>
              {linkList.map((link, index) => {
                const linkIconPrefixParsed = parseIconProps(link.iconPrefix);
                const linkIconSuffixParsed = parseIconProps(link.iconSuffix);
                return (
                  <Fragment key={`${link.link}_${index}`}>
                    {index > 0 && <div className={'text-neutral-3'}>、</div>}
                    {linkIconPrefixParsed && (
                      <Icon name={linkIconPrefixParsed.name} color={linkIconPrefixParsed.color} />
                    )}
                    <Link
                      href={link.link}
                      content={link.display}
                      suffixIcon={
                        linkIconSuffixParsed ? (
                          <Icon
                            name={linkIconSuffixParsed.name}
                            color={linkIconSuffixParsed.color}
                          />
                        ) : undefined
                      }
                    />
                  </Fragment>
                );
              })}
            </div>
          )}
          {tagList && (
            <div className={'flex items-center gap-1'}>
              {tagList.map((tag, index) => (
                <Tag content={tag} key={`${tag}_${index}`} />
              ))}
            </div>
          )}
        </div>
      </div>
      <ul
        className={`px-6 text-xs ${{ list: 'list-disc', paragraph: 'indent-2em', none: '' }[contentStyle]}`}
      >
        {contentList.map((content, index) => (
          <li key={`${content}_${index}`}>{renderText(content)}</li>
        ))}
      </ul>
    </div>
  );
};

export default SectionItem;
