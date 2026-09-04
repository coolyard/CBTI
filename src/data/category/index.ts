/**
 * 6 类别题库与 Q1 分流题聚合（由 scripts/build-match-table.py 生成，禁止手改）
 */
import type { Category, CategoryMeta, OptionKey, ThemeSplitQuestion } from '../../types'
import { CATEGORY_POOL } from '../../types'
import { rawQuestions as rawXiuxianQuestions } from './xiuxian'
import { rawQuestions as rawJianghuQuestions } from './jianghu'
import { rawQuestions as rawRexueQuestions } from './rexue'
import { rawQuestions as rawMoriQuestions } from './mori'
import { rawQuestions as rawGongtingQuestions } from './gongting'
import { rawQuestions as rawDushiQuestions } from './dushi'

export const themeSplitQuestion: ThemeSplitQuestion = {
  id: 0,
  type: 'theme-split',
  scene: '题材世界入口',
  stem: '你熬夜刷手机，屏幕突然弹出一行字：「请选择你要穿越的世界」。你鬼使神差地点了进去。',
  options: [
    {
      key: 'A',
      text: '废柴逆袭流：开局被退婚，三年后我要让整个宗门高攀不起',
      targetCategory: 'xiuxian'
    },
    {
      key: 'B',
      text: '庙堂江湖流：一边是波谲云诡的朝堂，一边是快意恩仇的江湖',
      targetCategory: 'jianghu'
    },
    {
      key: 'C',
      text: '热血竞技流：全国大赛擂台已就位，就等你从替补席上站起来',
      targetCategory: 'rexue'
    },
    {
      key: 'D',
      text: '末日求生流：感染者围城，避难所里的人性比外面更危险',
      targetCategory: 'mori'
    },
    {
      key: 'E',
      text: '宫斗宅斗流：赏花宴上笑语盈盈，每句话里都藏着一把刀',
      targetCategory: 'gongting'
    },
    {
      key: 'F',
      text: '都市丽人流：白天在职场厮杀，晚上和闺蜜撸串复盘人生',
      targetCategory: 'dushi'
    }
  ],
  designNote:
    '6 个题材即 6 个世界入口，用户感知为「选剧本」。题材标签直接明示（用户要的就是代入感），性别池映射不向用户展示。每个选项都是该题材的「经典开局梗」，保证 6 个都想进。'
}

export const CATEGORIES: Record<Category, CategoryMeta> = {
  xiuxian: {
    id: 'xiuxian',
    name: '修仙宗门',
    pool: CATEGORY_POOL.xiuxian,
    questions: rawXiuxianQuestions
  },
  jianghu: {
    id: 'jianghu',
    name: '江湖朝堂',
    pool: CATEGORY_POOL.jianghu,
    questions: rawJianghuQuestions
  },
  rexue: {
    id: 'rexue',
    name: '热血校园竞技',
    pool: CATEGORY_POOL.rexue,
    questions: rawRexueQuestions
  },
  mori: {
    id: 'mori',
    name: '末日求生',
    pool: CATEGORY_POOL.mori,
    questions: rawMoriQuestions
  },
  gongting: {
    id: 'gongting',
    name: '宫廷深宅后宫',
    pool: CATEGORY_POOL.gongting,
    questions: rawGongtingQuestions
  },
  dushi: {
    id: 'dushi',
    name: '都市闺蜜职场',
    pool: CATEGORY_POOL.dushi,
    questions: rawDushiQuestions
  }
}

const Q1_ROUTE: Record<OptionKey, Category> = {
  A: 'xiuxian',
  B: 'jianghu',
  C: 'rexue',
  D: 'mori',
  E: 'gongting',
  F: 'dushi'
}

export function getCategoryByQ1Option(key: OptionKey): CategoryMeta {
  const categoryId = Q1_ROUTE[key]
  return CATEGORIES[categoryId]
}
