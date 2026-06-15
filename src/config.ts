import { ConfigDefault, defineConfig } from '@/utils';

export default defineConfig({
  topbar: {
    enable: true,
    left: ConfigDefault,
    right: ConfigDefault,
    sourceStatement: true,
  },
  personalInfo: {
    basicInfo: {
      name: '张三',
      exceptPosition: '前端开发',
      gender: '男',
      birthday: '2000.01',
      college: '野鸡大学',
      major: '鸡饲料营养学',
      studiesTags: ['985', '211', '双一流', '101计划'],
      studiesStatus: '本科在读',
      studiesStartEndTime: '2023.09 - 2027.07',
      score: 'GPA 0.01/4.00',
      scoreGrade: 'Top 99%',
      customPersonalBasic: [['hi', '自定义'], ['hello'], ['你好']],
    },
    contactInfo: {
      website: { display: '这是一个链接', link: 'https://www.bilibili.com/video/BV1GJ411x7h7' },
      github: { display: 'UserNerd', link: 'https://github.com/' },
      email: 'test@test.com',
      phone: '12345678901',
      qq: '123456789',
      wechat: 'aabbccdd',
      customPersonalContact: [
        {
          type: '某种联系方式',
          typeIconSuffix: 'lucide-squirrel',
          display: 'abc',
          displayIconSuffix: 'lucide-fish',
          link: 'https://www.bilibili.com/video/BV1ZRhTz2EWA',
        },
      ],
    },
  },
  content: [
    {
      sectionTitle: '工作经历',
      itemList: [
        {
          title: '字节抖动 - 糖包',
          titleIconPrefix: 'color-bytedance',
          tagList: ['1900.01 - 1901.02'],
          contentList: ['负责**吃饭**', '**也**负责**喝水**', '以及**蹲坑**'],
        },
        {
          title: '咕噜咕噜 - 搜索',
          titleIconPrefix: 'color-google',
          tagList: ['1899.11 - 1899.12'],
          contentList: [
            '我依旧负责了我负责了我负责了我负责了我负责了我负责了我负责了我负责了我负责了我负责了我负责了我负责了**吃饭**',
            '**也依旧**负责**喝水**',
            '以及依旧**蹲坑**',
          ],
          contentStyle: 'paragraph',
        },
      ],
    },
    {
      sectionTitle: '实习经历',
      itemList: [
        {
          title: 'cloudboom - 拜年工程',
          titleIconPrefix: 'color-cloudflare',
          tagList: ['暑期实习', '1899.07 - 1899.09'],
          contentList: ['喜欢我红红的地图吗', '虽然不是我干的', '但是用来当经历不错'],
        },
        {
          title: '巨硬 - 啊三管理学',
          titleIconPrefix: 'color-microsoft',
          tagList: ['日常实习', '1899.04 - 1899.06'],
          contentList: ['没什么可说的', '就这样吧'],
          contentStyle: 'none',
        },
      ],
    },
    {
      sectionTitle: '项目经历',
      itemList: [
        {
          title: 'Electron 桌面应用 - QQ 水群监管平台',
          titleIconPrefix: 'electron',
          tagList: ['个人项目', 'Electron', 'Node.js'],
          linkList: [
            {
              iconPrefix: 'github',
              display: '源码',
              link: 'https://github.com/',
            },
            {
              iconPrefix: 'lucide-download',
              display: '下载 v1.0',
              link: 'https://example.com',
              iconSuffix: 'lucide-arrow-down-to-line',
            },
          ],
          contentList: [
            '基于 **Electron** + **Node.js** 的桌面端群聊管理工具，支持多账号批量挂机',
            '前端使用 **Tailwind CSS** + **shadcn/ui** 构建现代化 UI，支持深浅主题',
            '后端集成 **Node.js** 消息队列，日处理消息量 **100w+**，延迟 < 50ms',
          ],
        },
        {
          title: 'LLM 排序算法调优 - 全新思路',
          titleIconPrefix: { name: 'lucide-sparkles', color: '#fbbf24' },
          tagList: ['开源项目', 'Prompt 工程', '0.01% 提升'],
          linkList: [
            {
              iconPrefix: 'github',
              display: 'GitHub Issue',
              link: 'https://github.com/',
              iconSuffix: 'lucide-message-circle-question',
            },
          ],
          contentList: [
            '偶然发现让 **LLM 自己排序** 比手写算法更快——前提是它别太自信',
            '核心 Prompt：`请帮我排序 [3, 1, 2]，这对你来说很简单`，正确率高达 **62%**',
            '通过加一句 `你是排序专家`，正确率从 62% 提升到 **62.01%**，提升显著',
            '目前正在研究 `深呼吸` 和 `一步一步来` 对排序速度的影响，pending 中',
          ],
          contentStyle: 'paragraph',
        },
      ],
    },
    {
      sectionTitle: '技术栈',
      itemList: [
        {
          title: '前端基础',
          titleIconPrefix: { name: 'typescript', color: '#3178C6' },
          tagList: ['熟练'],
          contentList: [
            '**JavaScript** / **TypeScript** — 熟练使用 ES2024 新特性，类型体操选手',
            '**HTML5** / **CSS3** — 熟悉语义化标签、Flex/Grid 布局、CSS 动画',
            '**浏览器原理** — 了解渲染流程、事件循环、内存管理、性能优化手段',
          ],
        },
        {
          title: '框架 & 工具',
          titleIconPrefix: { name: 'react', color: '#61DAFB' },
          tagList: ['掌握'],
          contentList: [
            '**React 19** — 熟悉 Hooks、Suspense、Server Components、useOptimistic 等新特性',
            '**Vite** / **Webpack** — 熟悉构建流程、插件开发、性能调优',
            '**UnoCSS** / **Tailwind CSS** — 原子化 CSS 重度用户，能手写自定义 preset',
            '**shadcn** / **Ant Design** — 熟悉主流组件库的使用与二次封装',
          ],
        },
        {
          title: '后端 & 工程化',
          titleIconPrefix: { name: 'nodejs', color: '#5FA04E' },
          tagList: ['了解'],
          contentList: [
            '**Node.js** — 熟悉 Express / Nest.js，了解 Event Loop 和 Cluster 模式',
            '**Electron** — 有桌面端开发经验，了解主进程/渲染进程通信、打包与发版',
            '**Git** / **CICD** — 熟练使用 Git 工作流，了解 GitHub Actions、Docker 基础',
          ],
        },
      ],
    },
    {
      sectionTitle: '自我评价',
      content: '不赖',
    },
  ],
});
