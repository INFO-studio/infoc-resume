import type { ReactNode } from 'react';
import mergeDefault from '../mergeDefault';
import type { IconConfig } from '../parseIconProps';
import type { DeepRequired } from '../typeDeepRequired';

export const ConfigDefault = Symbol('ConfigDefault');

type DefaultType = typeof ConfigDefault;

export type ResumeConfigTopbar = {
  enable?: boolean;
  left?: DefaultType | ReactNode;
  right?: DefaultType | ReactNode;
  sourceStatement?: boolean | string;
};

export type ResumeConfigPersonalInfoBasicInfo = {
  name?: string;
  exceptPosition?: string;
  gender?: string;
  birthday?: string;
  college?: string;
  major?: string;
  studiesTags?: string[];
  studiesStatus?: string;
  studiesStartEndTime?: string;
  score?: string;
  scoreGrade?: string;
  customPersonalBasic?: Array<Array<ReactNode>>;
};

export type ResumeConfigPersonalInfoContactInfoCustomPersonalContactItem = {
  type: ReactNode;
  typeIconSuffix?: IconConfig;
  display: ReactNode;
  displayIconSuffix?: IconConfig;
  link?: string;
};

export type ResumeConfigPersonalInfoContactInfo = {
  website?: { display?: string; link?: string };
  github?: { display?: string; link?: string };
  email?: string;
  phone?: string;
  qq?: string;
  wechat?: string;
  customPersonalContact?: Array<ResumeConfigPersonalInfoContactInfoCustomPersonalContactItem>;
};

export type ResumeConfigPersonalInfo = {
  basicInfo?: ResumeConfigPersonalInfoBasicInfo;
  contactInfo?: ResumeConfigPersonalInfoContactInfo;
};

export type ResumeConfigContentItemItemListItemLinkListItem = {
  iconPrefix?: IconConfig;
  display: string;
  link: string;
  iconSuffix?: IconConfig;
};

export type ResumeConfigContentItemItemListItem = {
  title: string;
  titleIconPrefix?: IconConfig;
  linkList?: Array<ResumeConfigContentItemItemListItemLinkListItem>;
  tagList?: Array<string>;
  contentList: Array<string>;
  contentStyle?: 'list' | 'paragraph' | 'none';
};

export type ResumeConfigContentItem = {
  sectionTitle: string;
} & (
  | {
      itemList: Array<ResumeConfigContentItemItemListItem>;
    }
  | {
      content: ReactNode;
    }
);

export type ResumeConfigContentItemFull = {
  sectionTitle: string;
  itemList?: Array<ResumeConfigContentItemItemListItem>;
  content?: ReactNode;
};

export type ResumeConfig = {
  topbar?: ResumeConfigTopbar;
  personalInfo?: ResumeConfigPersonalInfo;
  content?: Array<ResumeConfigContentItem>;
};

const defaultConfig: DeepRequired<ResumeConfig> = {
  topbar: {
    enable: true,
    left: ConfigDefault,
    right: ConfigDefault,
    sourceStatement: false,
  },
  personalInfo: {
    basicInfo: {
      name: '<Config.personalInfo.name 修改您的姓名>',
      exceptPosition: '',
      gender: '<Config.personalInfo.gender 修改您的性别>',
      birthday: '<Config.personalInfo.gender 修改您的生日>',
      college: '<Config.personalInfo.college 修改您的教育经历>',
      major: '<Config.personalInfo.major 修改您的专业>',
      studiesTags: [],
      studiesStatus: '',
      studiesStartEndTime: '',
      score: '',
      scoreGrade: '',
      customPersonalBasic: [],
    },
    contactInfo: {
      website: { display: '', link: '' },
      github: { display: '', link: '' },
      email: '',
      phone: '',
      qq: '',
      wechat: '',
      customPersonalContact: [],
    },
  },
  content: [
    {
      sectionTitle: '<Config.content 修改您的简历正文>',
      content: '<Config.content 修改您的简历正文>',
    },
  ],
};

const defineConfig = (config: ResumeConfig) => mergeDefault(config, defaultConfig);

export default defineConfig;
