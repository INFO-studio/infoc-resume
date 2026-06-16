import type { IconName } from '@/components/icon';

export type IconConfig = IconName | { name: IconName; color?: string };

export type IconConfigInput = IconConfig | IconConfig[];

export type ParsedIconProps = { name: IconName; color?: string };

export const parseIconProps = (config: IconConfig | undefined): ParsedIconProps | undefined => {
  if (!config) return undefined;
  if (typeof config === 'string') return { name: config, color: undefined };
  return { name: config.name, color: config.color };
};

export const parseIconPropsList = (config: IconConfigInput | undefined): ParsedIconProps[] => {
  if (!config) return [];
  const list = Array.isArray(config) ? config : [config];
  return list
    .map((item) => parseIconProps(item))
    .filter((item): item is ParsedIconProps => item !== undefined);
};

export default parseIconProps;
