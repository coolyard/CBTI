/**
 * 男性角色匹配题库（15 题）
 * 内容与 CBTI_test_questions_gendered.md v3.0「一、男性角色匹配题库」逐字对应（specs/20 §4.3）
 * 场景氛围：修仙宗门、江湖朝堂、热血竞技、校园职场、末日求生
 */
import type { Question } from '../types'

export const rawQuestionsMale: Question[] = [
  {
    id: 1,
    type: 'gender-split',
    dimension: 'presence',
    scene: '穿越分流',
    stem: '你正在刷短视频，突然弹出一个「选择你的人生剧本」广告。你鬼使神差点了进去。',
    options: [
      {
        key: 'A',
        text: '你踏入修仙宗门，成了全宗寄予厚望的天才，宗门大比全场等你出场',
        band: 'H',
        targetPool: 'male'
      },
      {
        key: 'B',
        text: '你踏入深宫后院，成了刚入宫的常在，闺中密语已传遍六宫',
        band: 'M1',
        targetPool: 'female'
      },
      {
        key: 'C',
        text: '你踏入末日废墟，成了幸存者小队里负责望风的透明人',
        band: 'L',
        targetPool: 'male'
      },
      {
        key: 'D',
        text: '你踏入都市写字楼，成了项目组里「话不多但大家都想听你说」的核心',
        band: 'M2',
        targetPool: 'female'
      }
    ],
    designNote:
      '用「穿越选世界」分流：A→男性池，B→女性池，C→男性池（通用偏冒险），D→女性池（通用偏社交）。用户感知为「选剧情类型」而非「选性别」。'
  },
  {
    id: 2,
    type: 'normal',
    dimension: 'presence',
    scene: '修仙宗门',
    stem: '你参加宗门大典，全场数百人，长老突然点名让你发言。全场目光齐刷刷看向你。',
    options: [
      {
        key: 'A',
        text: '你低头假装系鞋带，心里默念「看不见我看不见我」，希望时间快进到下一个人',
        band: 'L'
      },
      {
        key: 'B',
        text: '你站起来简单说了两句，声音不大但条理清晰，说完立刻坐下，多一秒都不停留',
        band: 'M1'
      },
      {
        key: 'C',
        text: '你站起来侃侃而谈，越说越兴奋，甚至开始即兴发挥，完全忘了自己只准备了三句话',
        band: 'M2'
      },
      {
        key: 'D',
        text: '你站起来第一句话就让全场安静，第二句话让长老点头，第三句话让隔壁宗门的人开始记笔记',
        band: 'H'
      }
    ],
    designNote: 'B 和 C 的纠结点：「我是那种说完就撤的人，还是那种说到停不下来的人？」'
  },
  {
    id: 3,
    type: 'normal',
    dimension: 'presence',
    scene: '都市职场',
    stem: '你在公司年终汇报上被大老板突然点名总结全年，全部门同事的目光齐刷刷看向你。',
    options: [
      { key: 'A', text: '你低头假装找笔，心里默念「快叫下一个人快叫下一个人」', band: 'L' },
      { key: 'B', text: '你站起来简单说了三点，声音不大但逻辑清晰，说完立刻坐下', band: 'M1' },
      { key: 'C', text: '你站起来不仅总结了全年，还提出了明年的战略方向，越说越兴奋', band: 'M2' },
      {
        key: 'D',
        text: '你站起来第一句话让全场安静，第二句话让大老板点头，第三句话让隔壁部门开始记笔记',
        band: 'H'
      }
    ],
    designNote: 'B 和 C 的纠结点：「我是那种说完就撤的人，还是那种说到停不下来的人？」'
  },
  {
    id: 4,
    type: 'normal',
    dimension: 'cognition',
    scene: '江湖武侠',
    stem: '你和师弟下山历练，半路遭遇魔道埋伏。师弟受伤，对方人数是你们的三倍。',
    options: [
      { key: 'A', text: '你拔出剑就冲上去，结果三招被制服，师弟还得反过来救你', band: 'L' },
      { key: 'B', text: '你拖着师弟躲进破庙，先疗伤再想办法，但心里慌得一批', band: 'M1' },
      { key: 'C', text: '你一边假装投降拖延时间，一边观察地形，找机会从后山溜走', band: 'M2' },
      { key: 'D', text: '你扫了一眼地形，立刻制定诱敌深入+火攻+暗器三连计划', band: 'H' }
    ],
    designNote: 'B 和 C 的纠结点：「我是先保命再想办法，还是边打边算？」'
  },
  {
    id: 5,
    type: 'normal',
    dimension: 'cognition',
    scene: '校园职场',
    stem: '你和室友组队做毕设，答辩前一周发现TA偷偷把你的名字从论文作者里删了，还准备独自发表。',
    options: [
      { key: 'A', text: '你当场撕了论文说「这学位我不要了，但你这辈子别想安生」', band: 'L' },
      { key: 'B', text: '你默默收集聊天记录和实验数据，等答辩时一起呈给导师', band: 'M1' },
      {
        key: 'C',
        text: '你主动帮TA完善论文，实则在关键数据处留下破绽，等TA发表后反杀',
        band: 'M2'
      },
      {
        key: 'D',
        text: '你提前两周预判到这一步，留了证据，还联系了期刊编辑和学术委员会',
        band: 'H'
      }
    ],
    designNote: 'B 和 C 的纠结点：「我是直接硬刚还是迂回反击？」'
  },
  {
    id: 6,
    type: 'normal',
    dimension: 'cognition',
    scene: '历史朝堂',
    stem: '你在朝堂上发现同僚私通外敌，准备在你负责的边防部署上动手脚。你知道说出去会被反咬一口。',
    options: [
      { key: 'A', text: '你当场在朝堂上揭发，结果被对方反咬一口说你诬陷，被贬边疆', band: 'L' },
      { key: 'B', text: '你默默收集密信和往来记录，等皇上巡视时一起呈上去', band: 'M1' },
      { key: 'C', text: '你故意放出假情报，等对方按假情报行动时当场抓获，人赃并获', band: 'M2' },
      { key: 'D', text: '你提前布局，让对方以为得手，实则引他入更大的局，连根拔起', band: 'H' }
    ],
    designNote: 'B 和 C 的纠结点：「我是收集证据等时机，还是主动设局引蛇出洞？」'
  },
  {
    id: 7,
    type: 'normal',
    dimension: 'emotion',
    scene: '修仙宗门',
    stem: '你的道侣闭关前说「三年后出关」，结果三百年过去了，山门都快塌了TA还没出来。',
    options: [
      { key: 'A', text: '你早就把TA的洞府改成了储物间，门口贴着「出租，非诚勿扰」', band: 'L' },
      {
        key: 'B',
        text: '你每隔十年去洞口喊一嗓子「还活着吗」，没回应就继续该干嘛干嘛',
        band: 'M1'
      },
      {
        key: 'C',
        text: '你表面上云淡风轻，但每晚都会去洞口坐一会儿，对着月光自言自语',
        band: 'M2'
      },
      {
        key: 'D',
        text: '你强行破关，哪怕毁TA修为也要见一面，「三百年，一天都不想再等」',
        band: 'H'
      }
    ],
    designNote: 'B 和 C 的纠结点：「我是嘴上不在乎但心里惦记的人，还是表面淡定但深夜emo的人？」'
  },
  {
    id: 8,
    type: 'normal',
    dimension: 'emotion',
    scene: '热血竞技',
    stem: '你和队友备战全国总决赛三年，赛前一周发现TA偷偷把你的战术笔记卖给了对手。',
    options: [
      {
        key: 'A',
        text: '你直接退赛，在社交媒体上曝光TA，「这比赛我不打了，但你这辈子别想安生」',
        band: 'L'
      },
      {
        key: 'B',
        text: '你去找TA对质，TA说「我也是被逼的」，你沉默了很久，最后说「我理解」',
        band: 'M1'
      },
      {
        key: 'C',
        text: '你表面上说「比赛重要」，但从此不再和任何人组队，心里那道坎过不去',
        band: 'M2'
      },
      {
        key: 'D',
        text: '你抱着TA说「你可以卖笔记，但不能卖我们三年的信任」，然后独自上场打完比赛',
        band: 'H'
      }
    ],
    designNote: 'B 和 C 的纠结点：「我是当场心软的人，还是表面原谅但心里记一辈子的人？」'
  },
  {
    id: 9,
    type: 'normal',
    dimension: 'emotion',
    scene: '末日求生',
    stem: '你在末日避难所里，最好的兄弟为了多拿一份抗生素，在投票时把你推出去当诱饵。',
    options: [
      { key: 'A', text: '你直接把抗生素砸了，「谁都别活」', band: 'L' },
      {
        key: 'B',
        text: '你去找他理论，他哭着说「我也是没办法」，你听完转身走了，没再回头',
        band: 'M1'
      },
      { key: 'C', text: '你表面上原谅了他，但从此睡觉都睁一只眼，不再信任任何人', band: 'M2' },
      {
        key: 'D',
        text: '你把抗生素让给他，说「你活着比我活着有用」，然后独自引开感染者',
        band: 'H'
      }
    ],
    designNote: 'B 和 C 的纠结点：「我是默默离开的人，还是表面原谅但彻底封闭内心的人？」'
  },
  {
    id: 10,
    type: 'normal',
    dimension: 'order',
    scene: '都市职场',
    stem: '你发现公司CEO在财报上造假，你知道说出去会被行业封杀，不说出去投资人会血本无归。',
    options: [
      { key: 'A', text: '你选择装作不知道，「公司的事关我屁事，我工资又不少一分」', band: 'L' },
      {
        key: 'B',
        text: '你选择先找CEO「聊聊」，暗示自己知道了，看他愿不愿意给你封口费',
        band: 'M1'
      },
      { key: 'C', text: '你选择收集证据和内部邮件，等董事会换届再捅出去，一击必杀', band: 'M2' },
      {
        key: 'D',
        text: '你选择在全员大会上直接发邮件，「规矩就是规矩，今天这桩事我必须管」',
        band: 'H'
      }
    ],
    designNote: 'B 和 C 的纠结点：「我是那种先谈条件的人，还是那种收集证据等时机的人？」'
  },
  {
    id: 11,
    type: 'normal',
    dimension: 'order',
    scene: '热血竞技',
    stem: '你在宗门大比决赛上发现对手偷偷服用了禁药，裁判长老似乎睁一只眼闭一只眼。',
    options: [
      { key: 'A', text: '你选择装作不知道，反正赢了也是赢，输了就怪自己不够强', band: 'L' },
      {
        key: 'B',
        text: '你赛后私下找裁判理论，语气委婉地说「晚辈觉得刚才那场有点蹊跷」',
        band: 'M1'
      },
      { key: 'C', text: '你把对手服药的证据拍在掌门面前，要求重赛并取消他的资格', band: 'M2' },
      { key: 'D', text: '你直接在大比现场揭穿他，当着全宗门的面说「这规矩今天必须守」', band: 'H' }
    ],
    designNote: 'B 和 C 的纠结点：「我是那种委婉提醒的人，还是那种公开处刑的人？」'
  },
  {
    id: 12,
    type: 'normal',
    dimension: 'endurance',
    scene: '修仙宗门',
    stem: '你修仙渡劫失败，被雷劈回了筑基期，全宗门都在传「那个天才废了」。',
    options: [
      {
        key: 'A',
        text: '你躺在洞府里三个月没出门，最后决定下山开客栈，「修仙不适合我」',
        band: 'L'
      },
      {
        key: 'B',
        text: '你花了三个月疗伤，每天对着破碎金丹发呆，但最终还是决定从头再来',
        band: 'M1'
      },
      {
        key: 'C',
        text: '你表面上说「没事，重来就好」，但每晚梦到那道雷，醒来照常修炼',
        band: 'M2'
      },
      {
        key: 'D',
        text: '你从坑里爬出来，指着天说「再来，站得更高让你劈，我命由我不由天」',
        band: 'H'
      }
    ],
    designNote: 'B 和 C 的纠结点：「我是慢慢恢复的人，还是表面没事但深夜emo的人？」'
  },
  {
    id: 13,
    type: 'normal',
    dimension: 'endurance',
    scene: '都市职场',
    stem: '你创业三年，公司破产，负债百万，全朋友圈都在传「那个CEO废了」。',
    options: [
      { key: 'A', text: '你注销公司，回老家考公务员，「创业不适合我」', band: 'L' },
      { key: 'B', text: '你花了三个月复盘，每天对着破产报告发呆，但决定从头再来', band: 'M1' },
      {
        key: 'C',
        text: '你表面上说「没事，经验比钱重要」，但每晚梦到催债电话，醒来照常投简历',
        band: 'M2'
      },
      {
        key: 'D',
        text: '你从废墟里爬出来，指着行业说「再来，站得更高让你看，我命由我不由天」',
        band: 'H'
      }
    ],
    designNote: 'B 和 C 的纠结点：「我是慢慢恢复的人，还是表面没事但深夜emo的人？」'
  },
  {
    id: 14,
    type: 'easter',
    dimension: 'order',
    scene: '修仙宗门',
    stem: '你知道宗门规定「秘境资源按贡献分配」，却发现长老偷偷把最好的灵草留给了自己的亲传弟子。',
    options: [
      { key: 'A', text: '你选择装作不知道，资源给谁不是给，反正你本来也没指望', band: 'L' },
      { key: 'B', text: '你也偷偷多拿一份，心想「大家都拿，我不拿就亏了」', band: 'M1' },
      {
        key: 'C',
        text: '你表面上按规定领一份，但暗中记录了长老的所有违规操作，准备时机成熟一起举报',
        band: 'M2',
        seedTag: 'wukong'
      },
      {
        key: 'D',
        text: '你直接当着所有人的面说「规矩是给你们定的，今天这资源我按贡献重新分」',
        band: 'H',
        seedTag: 'nezha'
      }
    ],
    designNote: 'C 植入黑神话悟空种子（隐忍后爆发），D 植入魔童哪吒种子（反骨、打破规则）。'
  },
  {
    id: 15,
    type: 'easter',
    dimension: 'endurance',
    scene: '江湖朝堂',
    stem: '你在边疆战场被敌军包围，全军覆没，只有你一人杀出重围，但身负重伤。',
    options: [
      { key: 'A', text: '你爬进附近村庄，把盔甲卖了换酒钱，决定从此做个普通人', band: 'L' },
      {
        key: 'B',
        text: '你花了三个月养伤，每天对着阵亡将士的名单发呆，但最终还是决定归队',
        band: 'M1'
      },
      {
        key: 'C',
        text: '你表面上说「没事，活着就好」，但每晚梦到战场，醒来照常操练',
        band: 'M2',
        seedTag: 'wukong'
      },
      {
        key: 'D',
        text: '你伤好后单枪匹马杀回敌营，「这条命硬得很，兄弟们不能白死，再来」',
        band: 'H',
        seedTag: 'nezha'
      }
    ],
    designNote:
      'C 植入黑神话悟空种子（历经磨难、越战越勇），D 植入魔童哪吒种子（嚣张反骨、不服天命）。'
  }
]
