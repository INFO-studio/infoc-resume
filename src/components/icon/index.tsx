import { DynamicIcon, type IconName as LucideIconName } from 'lucide-react/dynamic';
import type { CSSProperties, FC } from 'react';
import BytedanceIcon from '@/assets/icons/BytedanceIcon';
import ColorBytedanceIcon from '@/assets/icons/ColorBytedanceIcon';
import ColorCloudflareIcon from '@/assets/icons/ColorCloudflareIcon';
import ColorGoogleIcon from '@/assets/icons/ColorGoogleIcon';
import ColorMicrosoftIcon from '@/assets/icons/ColorMicrosoftIcon';
import ElectronIcon from '@/assets/icons/ElectronIcon';
import GithubIcon from '@/assets/icons/GithubIcon';
import JavascriptIcon from '@/assets/icons/JavascriptIcon';
import LynxIcon from '@/assets/icons/LynxIcon';
import NodedotjsIcon from '@/assets/icons/NodedotjsIcon';
import QQIcon from '@/assets/icons/QQIcon';
import ReactIcon from '@/assets/icons/ReactIcon';
import SassIcon from '@/assets/icons/SassIcon';
import ShadcnuiIcon from '@/assets/icons/ShadcnuiIcon';
import TailwindcssIcon from '@/assets/icons/TailwindcssIcon';
import TypescriptIcon from '@/assets/icons/TypescriptIcon';
import UnocssIcon from '@/assets/icons/UnocssIcon';
import ViteIcon from '@/assets/icons/ViteIcon';
import VueIcon from '@/assets/icons/VueIcon';
import WechatIcon from '@/assets/icons/WechatIcon';

const ICONS = {
  react: ReactIcon,
  unocss: UnocssIcon,
  vite: ViteIcon,
  github: GithubIcon,
  bytedance: BytedanceIcon,
  'color-bytedance': ColorBytedanceIcon,
  'color-cloudflare': ColorCloudflareIcon,
  'color-google': ColorGoogleIcon,
  'color-microsoft': ColorMicrosoftIcon,
  qq: QQIcon,
  wechat: WechatIcon,
  javascript: JavascriptIcon,
  typescript: TypescriptIcon,
  electron: ElectronIcon,
  nodejs: NodedotjsIcon,
  tailwindcss: TailwindcssIcon,
  'shadcn-ui': ShadcnuiIcon,
  vue: VueIcon,
  sass: SassIcon,
  lynx: LynxIcon,
} as const;

export type IconAssetName = keyof typeof ICONS;
export type IconLucideName = `lucide-${LucideIconName}`;
export type IconName = IconAssetName | IconLucideName;

export type IconProps = {
  name: IconName;
  size?: number | string;
  color?: string;
  className?: string;
  style?: CSSProperties;
};

const Icon: FC<IconProps> = ({ name, size = '1em', color, className, style }) => {
  const dim: Record<string, string | number | undefined> = {};
  dim.width = typeof size === 'number' ? `${size}px` : size;
  dim.height = typeof size === 'number' ? `${size}px` : size;

  if (name.startsWith('lucide-')) {
    return <DynamicIcon size={size} color={color} name={name.slice(7) as LucideIconName} />;
  }

  const Comp = ICONS[name as IconAssetName];
  if (!Comp) return null;

  return (
    <Comp
      width={dim.width}
      height={dim.height}
      fill={color}
      className={className}
      style={{ color, ...style }}
    />
  );
};

export default Icon;
