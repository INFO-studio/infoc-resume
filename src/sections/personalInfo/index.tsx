/** biome-ignore-all lint/suspicious/noArrayIndexKey: partial */
import { type FC, Fragment } from 'react';
import { Icon, Link, Tag } from '@/components';
import { useResumeConfig } from '@/contexts/resumeConfigContext';
import { parseIconProps } from '@/utils';

const ContactRow: FC<{ href?: string; children: React.ReactNode }> = ({ href, children }) => {
  const content = <>{children}</>;
  return href ? (
    <Link href={href} content={content} suffixIcon={null} />
  ) : (
    <div className={'flex items-center gap-1 justify-end text-neutral-2'}>{children}</div>
  );
};

const PersonalInfo: FC = () => {
  const { config } = useResumeConfig();
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
      <div className={'px-4 flex justify-between text-neutral-2 text-sm'}>
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
            </div>
          )}
          <div className={'flex items-center gap-1 flex-wrap'}>
            {studiesTags.map((tag, i) => (
              <Tag key={`${tag}_${i}`} content={tag} />
            ))}
          </div>
          {(studiesStatus || studiesStartEndTime) && (
            <div className={'flex items-center gap-1'}>
              {studiesStatus && <div>{studiesStatus}</div>}
              {studiesStatus && studiesStartEndTime && (
                <div className={'text-neutral-3 font-bold'}>/</div>
              )}
              {studiesStartEndTime && <div>{studiesStartEndTime}</div>}
            </div>
          )}
          {(score || scoreGrade) && (
            <div className={'flex items-center gap-1'}>
              {score && <div>{score}</div>}
              {score && scoreGrade && <div className={'text-neutral-3 font-bold'}>/</div>}
              {scoreGrade && <div>{scoreGrade}</div>}
            </div>
          )}
          {customPersonalBasic.map((row, idx) => (
            <div key={`customBasic_${idx}`} className={'flex items-center gap-1'}>
              {row.map((cell, i) => (
                <Fragment key={`${idx}_${i}`}>
                  {i > 0 && <div className={'text-neutral-3 font-bold'}>/</div>}
                  <div>{cell}</div>
                </Fragment>
              ))}
            </div>
          ))}
        </div>

        <div className={'flex flex-col gap-1'}>
          {website?.link ? (
            <ContactRow href={website.link}>
              <Icon name={'lucide-globe'} size={14} />
              <div className="text-primary-fg">{website.display ?? website.link}</div>
            </ContactRow>
          ) : null}
          {github?.link ? (
            <ContactRow href={github.link}>
              <Icon name={'github'} size={14} />
              <div className="text-primary-fg">{github.display ?? github.link}</div>
            </ContactRow>
          ) : null}
          {email ? (
            <ContactRow href={`mailto:${email}`}>
              <Icon name={'lucide-mail'} size={14} />
              <div className="text-primary-fg">{email}</div>
            </ContactRow>
          ) : null}
          {phone ? (
            <ContactRow href={`tel:${phone}`}>
              <Icon name={'lucide-phone'} size={14} />
              <div className="text-primary-fg">{phone}</div>
            </ContactRow>
          ) : null}
          {qq ? (
            <ContactRow>
              <Icon name={'lucide-message-circle'} size={14} />
              <div>QQ: {qq}</div>
            </ContactRow>
          ) : null}
          {wechat ? (
            <ContactRow>
              <Icon name={'lucide-message-square'} size={14} />
              <div>微信: {wechat}</div>
            </ContactRow>
          ) : null}
          {customPersonalContact.map((item, i) => {
            const typeIcon = parseIconProps(item.typeIconSuffix);
            const dispIcon = parseIconProps(item.displayIconSuffix);
            const body = (
              <>
                {typeIcon ? <Icon {...typeIcon} size={14} /> : null}
                <div>{item.type}</div>
                <div className={'text-neutral-3 font-bold'}>:</div>
                {dispIcon ? <Icon {...dispIcon} size={14} /> : null}
                <div>{item.display}</div>
              </>
            );
            return (
              <ContactRow key={`customContact_${i}`} href={item.link}>
                {body}
              </ContactRow>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
