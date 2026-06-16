import type { FC } from 'react';
import { PersonalInfo, Topbar } from '@/sections';
import Content from '@/sections/content';

const App: FC = () => {
  return (
    <div className={'bg-neutral-4 w-full h-full px-8 pb-8 flex flex-col text-neutral-1'}>
      <Topbar />
      <div className={'p-4 flex-1 bg-neutral-5 rounded-4 flex flex-col gap-2'}>
        <PersonalInfo />
        <Content />
      </div>
    </div>
  );
};

export default App;
