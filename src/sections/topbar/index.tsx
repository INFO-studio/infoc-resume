import dayjs from 'dayjs';
import type { FC } from 'react';
import { Icon } from '@/components';

import { useResumeConfig } from '@/contexts/resumeConfigContext';
import { ConfigDefault } from '@/utils';

const Topbar: FC = () => {
  const { config } = useResumeConfig();
  const { enable, left, right, sourceStatement } = config.topbar;

  if (!enable) {
    return <div className={'h-8'} />;
  }

  return (
    <div className={'h-8 px-4 flex justify-between items-center text-neutral-3 text-xs font-bold'}>
      {left === ConfigDefault ? (
        <div className={'flex items-center gap-.5'}>
          <div>本简历使⽤</div>
          <div className={'flex items-center gap-.25'}>
            <Icon name={'react'} className={'-mb-1px'} />
            <div>React19</div>
          </div>
          <div>/</div>
          <div className={'flex items-center gap-.25'}>
            <Icon name={'vite'} className={'-mb-1px'} />
            <div>Vite8</div>
          </div>
          <div>/</div>
          <div className={'flex items-center gap-.25'}>
            <Icon name={'unocss'} className={'-mb-1px'} />
            <div>UnoCSS</div>
          </div>
          <div>创建</div>
        </div>
      ) : (
        left
      )}
      <div className={'flex gap-1'}>
        {right === ConfigDefault ? <div>{dayjs().format('YYYY-MM-DD')}</div> : right}
        {sourceStatement === false ? null : (
          <div>{sourceStatement === true ? '@InfoC Resume' : sourceStatement}</div>
        )}
      </div>
    </div>
  );
};

export default Topbar;
