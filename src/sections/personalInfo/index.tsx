/** biome-ignore-all lint/suspicious/noArrayIndexKey: partial */
import { type FC, Fragment } from 'react';
import { Icon, Link, Tag } from '@/components';
import config from '@/config';
import { parseIconProps } from '@/utils';

const PersonalInfo: FC = () => {
  const { basicInfo, contactInfo } = config.personalInfo;
  const {
    name,
    exceptPosition,
    gender,
    birthday,
    college,
    major,
    studiesTags,
    studiesStatus,
    studiesStartEndTime,
    score,
    scoreGrade,
    customPersonalBasic,
  } = basicInfo;
  const { website, github, email, phone, qq, wechat, customPersonalContact } = contactInfo;
  return (
    <div className={'flex flex-col gap-1 text-sm'}>
      <div className={'px-4 flex justify-between items-end'}>
        <div className={'text-2xl font-extrabold'}>{name}</div>
        <div className={'text-lg truncate'}>{exceptPosition}</div>
      </div>
      <div className={'h-2px rounded-full bg-primary-fg'} />
      <div className={'px-4 flex justify-between text-neutral-2'}>
        <div className={'flex flex-col'}>
          {(gender || birthday) && (
            <div className={'flex items-center gap-1'}>
              {gender && <div className={'truncate'}>{gender}</div>}
              {gender && birthday && <div className={'text-neutral-3 font-bold'}>/</div>}
              {birthday && <div className={'truncate'}>{birthday}</div>}
            </div>
          )}
          {(college || major) && (
            <div className={'flex items-center gap-1'}>
              {college && <div className={'truncate'}>{college}</div>}
              {college && major && <div className={'text-neutral-3 font-bold'}>/</div>}
              {major && <div className={'truncate'}>{major}</div>}
              {studiesTags.map((tag, index) => (
                <Tag key={`${tag}_${index}`} content={tag} />
              ))}
            </div>
          )}
          {(studiesStatus || studiesStartEndTime) && (
            <div className={'flex items-center gap-1'}>
              {studiesStatus && <div className={'truncate'}>{studiesStatus}</div>}
              {studiesStatus && studiesStartEndTime && (
                <div className={'text-neutral-3 font-bold'}>/</div>
              )}
              {studiesStartEndTime && <div className={'truncate'}>{studiesStartEndTime}</div>}
            </div>
          )}
          {(score || scoreGrade) && (
            <div className={'flex items-center gap-1'}>
              {score && <div className={'truncate'}>{score}</div>}
              {score && scoreGrade && <div className={'text-neutral-3 font-bold'}>/</div>}
              {scoreGrade && <div className={'truncate'}>{scoreGrade}</div>}
            </div>
          )}
          {customPersonalBasic?.map((customLine, indexLine) => (
            <div key={`${customLine.join('-')}_${indexLine}`} className={'flex items-center gap-1'}>
              {customLine.map((custom, indexCustom) => (
                <Fragment key={`${custom}_${indexCustom}`}>
                  {indexCustom > 0 && <div className={'text-neutral-3 font-bold'}>/</div>}
                  {<div className={'truncate'}>{custom}</div>}
                </Fragment>
              ))}
            </div>
          ))}
        </div>
        <div className={'flex flex-col items-end'}>
          {website.display && (
            <div className={'flex items-center gap-1'}>
              <div className={'truncate'}>个人主页</div>
              <Icon name={'lucide-globe'} />
              <div className={'text-neutral-3 font-bold'}>/</div>
              <Link href={website.link} content={website.display} />
            </div>
          )}
          {github.display && (
            <div className={'flex items-center gap-1'}>
              <div className={'truncate'}>Github</div>
              <Icon name={'github'} />
              <div className={'text-neutral-3 font-bold'}>/</div>
              <Link href={github.link} content={github.display} />
            </div>
          )}
          {email && (
            <div className={'flex items-center gap-1'}>
              <div className={'truncate'}>邮箱</div>
              <Icon name={'lucide-mail'} />
              <div className={'text-neutral-3 font-bold'}>/</div>
              <Link
                href={`mailto:${email}`}
                suffixIcon={<Icon name={'lucide-send'} />}
                content={email}
              />
            </div>
          )}
          {phone && (
            <div className={'flex items-center gap-1'}>
              <div className={'truncate'}>电话</div>
              <Icon name={'lucide-phone'} />
              <div className={'text-neutral-3 font-bold'}>/</div>
              <Link
                href={`tel:${phone}`}
                suffixIcon={<Icon name={'lucide-phone-forwarded'} />}
                content={phone}
              />
            </div>
          )}
          {qq && (
            <div className={'flex items-center gap-1'}>
              <div className={'truncate'}>QQ</div>
              <Icon name={'qq'} />
              <div className={'text-neutral-3 font-bold'}>/</div>
              <div className={'truncate'}>{qq}</div>
            </div>
          )}
          {wechat && (
            <div className={'flex items-center gap-1'}>
              <div className={'truncate'}>微信</div>
              <Icon name={'wechat'} />
              <div className={'text-neutral-3 font-bold'}>/</div>
              <div className={'truncate'}>{wechat}</div>
            </div>
          )}
          {customPersonalContact.map((customContact, index) => {
            const typeIconSuffixParsed = parseIconProps(customContact.typeIconSuffix);
            const displayIconSuffixParsed = parseIconProps(customContact.displayIconSuffix);
            return (
              <div key={`${customContact}_${index}`} className={'flex items-center gap-1'}>
                <div className={'truncate'}>{customContact.type}</div>
                {typeIconSuffixParsed && (
                  <Icon name={typeIconSuffixParsed.name} color={typeIconSuffixParsed.color} />
                )}
                <div className={'text-neutral-3 font-bold'}>/</div>
                {customContact.link ? (
                  <Link
                    href={customContact.link}
                    suffixIcon={
                      displayIconSuffixParsed ? (
                        <Icon
                          name={displayIconSuffixParsed.name}
                          color={displayIconSuffixParsed.color}
                        />
                      ) : null
                    }
                    content={customContact.display}
                  />
                ) : (
                  <>
                    <div className={'truncate'}>{customContact.display}</div>
                    {displayIconSuffixParsed && (
                      <Icon
                        name={displayIconSuffixParsed.name}
                        color={displayIconSuffixParsed.color}
                      />
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
