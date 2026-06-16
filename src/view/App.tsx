import type { FC } from 'react';
import { Content, PersonalInfo, Topbar } from '@/sections';

const App: FC = () => {
  return (
    <div className={'bg-neutral-4 w-full h-full px-8 pb-8 flex flex-col text-neutral-1'}>
      <Topbar />
      <div className={'px-4 py-2.5 flex-1 bg-neutral-5 rounded-4 flex flex-col gap-.5'}>
        <PersonalInfo />
        <Content />
      </div>
    </div>
  );
};

export default App;
