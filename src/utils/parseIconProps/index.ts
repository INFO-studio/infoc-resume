import type { IconName } from '@/components/icon';

export type IconConfig = IconName | { name: IconName; color?: string };

export type ParsedIconProps = { name: IconName; color?: string };

export const parseIconProps = (config: IconConfig | undefined): ParsedIconProps | undefined => {
  if (!config) return undefined;
  if (typeof config === 'string') return { name: config, color: undefined };
  return { name: config.name, color: config.color };
};

export default parseIconProps;
