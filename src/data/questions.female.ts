/**
 * 女性角色匹配题库（15 题）
 * 内容与 CBTI_test_questions_gendered.md v3.0「二、女性角色匹配题库」逐字对应（specs/20 §4.3）
 * 场景氛围：后宫宫斗、深宅大院、都市闺蜜、校园职场、末日求生
 */
import type { Question } from '../types'

export const rawQuestionsFemale: Question[] = [
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
    designNote: '与男性题库第 1 题相同，分流映射一致：A→男性池，B→女性池，C→男性池，D→女性池。'
  },
  {
    id: 2,
    type: 'normal',
    dimension: 'presence',
    scene: '后宫宫斗',
    stem: '你参加后宫赏花宴，皇后突然让你表演才艺，全场嫔妃的目光齐刷刷刺过来。',
    options: [
      { key: 'A', text: '你假装崴脚，顺势往地上一倒，心里默念「快叫太医快叫太医」', band: 'L' },
      { key: 'B', text: '你站起来简单行了个礼，声音不大但仪态端庄，说完立刻低头退后', band: 'M1' },
      { key: 'C', text: '你站起来不仅表演了才艺，还即兴编了首诗让皇上龙颜大悦', band: 'M2' },
      { key: 'D', text: '你站起来三句话让全场安静，皇后微笑，皇上当场晋你位份', band: 'H' }
    ],
    designNote: 'B 和 C 的纠结点：「我是那种说完就撤的人，还是那种说到停不下来的人？」'
  },
  {
    id: 3,
    type: 'normal',
    dimension: 'presence',
    scene: '都市闺蜜',
    stem: '你在闺蜜生日会上被 cue 到说几句祝福，所有人的目光齐刷刷看向你。',
    options: [
      { key: 'A', text: '你低头假装看手机，心里默念「快切蛋糕快切蛋糕」', band: 'L' },
      { key: 'B', text: '你站起来简单说了两句，声音不大但真诚温暖，说完立刻坐下', band: 'M1' },
      {
        key: 'C',
        text: '你站起来不仅说了祝福，还即兴讲了个段子让全场笑翻，完全忘了自己只准备了一句话',
        band: 'M2'
      },
      {
        key: 'D',
        text: '你站起来三句话让全场安静，闺蜜当场哭出声，寿星本人都忘了自己是主角',
        band: 'H'
      }
    ],
    designNote: 'B 和 C 的纠结点：「我是那种说完就撤的人，还是那种说到停不下来的人？」'
  },
  {
    id: 4,
    type: 'normal',
    dimension: 'cognition',
    scene: '深宅大院',
    stem: '你和闺蜜参加赏花宴，半路遭遇嫡福晋刁难。闺蜜被当众羞辱，对方身份比你们高三级。',
    options: [
      { key: 'A', text: '你冲上去就怼，结果三句话被反杀，闺蜜还得反过来帮你求情', band: 'L' },
      { key: 'B', text: '你拉着闺蜜躲进偏殿，先稳住她再想办法，但心里慌得一批', band: 'M1' },
      {
        key: 'C',
        text: '你一边假装认错拖延时间，一边观察嫡福晋的破绽，找机会反将一军',
        band: 'M2'
      },
      { key: 'D', text: '你扫了一眼全场，立刻制定借刀杀人+舆论反转+皇后背书三连计划', band: 'H' }
    ],
    designNote: 'B 和 C 的纠结点：「我是先保命再想办法，还是边打边算？」'
  },
  {
    id: 5,
    type: 'normal',
    dimension: 'cognition',
    scene: '都市职场',
    stem: '你刚入职三个月，发现直属女上司在抢你的项目成果，准备在大老板面前邀功。',
    options: [
      {
        key: 'A',
        text: '你当场冲进会议室说「这项目是我做的」，结果被打成不懂规矩的新人',
        band: 'L'
      },
      { key: 'B', text: '你默默收集邮件和聊天记录，等季度汇报时一起呈上去', band: 'M1' },
      { key: 'C', text: '你主动找上司「合作」，帮她完善方案，实则在她汇报时埋下漏洞', band: 'M2' },
      { key: 'D', text: '你提前两周预判到这一步，留了证据，还暗中联系了大老板的助理', band: 'H' }
    ],
    designNote: 'B 和 C 的纠结点：「我是直接硬刚还是迂回反击？」'
  },
  {
    id: 6,
    type: 'normal',
    dimension: 'cognition',
    scene: '后宫宫斗',
    stem: '你刚入宫三个月，发现贵妃在皇后面前抢了你的恩宠，准备借此晋位。',
    options: [
      { key: 'A', text: '你当场冲进凤仪宫说「这恩宠是我得的」，结果被打入冷宫思过', band: 'L' },
      { key: 'B', text: '你默默收集贵妃的把柄和宫女的证词，等皇后生辰宴时一起呈上去', band: 'M1' },
      { key: 'C', text: '你主动找贵妃「合作」，帮她固宠，实则在她晋位时埋下陷阱', band: 'M2' },
      { key: 'D', text: '你提前两周预判到这一步，留了后手，还暗中联系了太后身边的嬷嬷', band: 'H' }
    ],
    designNote: 'B 和 C 的纠结点：「我是收集证据等时机，还是主动设局引蛇出洞？」'
  },
  {
    id: 7,
    type: 'normal',
    dimension: 'emotion',
    scene: '深宅大院',
    stem: '你的青梅竹马出征前说「一年后归来娶你」，结果十年过去了，边疆战事还没结束。',
    options: [
      { key: 'A', text: '你早就把他的画像收进了箱子底，门口贴着「出租，非诚勿扰」', band: 'L' },
      {
        key: 'B',
        text: '你每隔一年去城门口望一嗓子「回来了吗」，没回应就继续该干嘛干嘛',
        band: 'M1'
      },
      {
        key: 'C',
        text: '你表面上云淡风轻，但每晚都会去城墙上坐一会儿，对着月光自言自语',
        band: 'M2'
      },
      {
        key: 'D',
        text: '你女扮男装奔赴边疆，哪怕战死也要见他一面，「十年，一天都不想再等」',
        band: 'H'
      }
    ],
    designNote: 'B 和 C 的纠结点：「我是嘴上不在乎但心里惦记的人，还是表面淡定但深夜emo的人？」'
  },
  {
    id: 8,
    type: 'normal',
    dimension: 'emotion',
    scene: '都市闺蜜',
    stem: '你和闺蜜创业三年，一次融资谈判中她为了独吞股份，把你从合伙人名单里删了。',
    options: [
      { key: 'A', text: '你直接把合同撕了，说「这公司我不要了，但你这辈子别想安生」', band: 'L' },
      { key: 'B', text: '你去找她对质，她哭着说「我也是被逼的」，你听完沉默了很久', band: 'M1' },
      { key: 'C', text: '你表面上原谅了她，但从此不再和任何人合伙，心里那道坎过不去', band: 'M2' },
      {
        key: 'D',
        text: '你抱着她说「你可以骗我，但不能骗我你把我当朋友」，然后帮她扛了债务',
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
    stem: '你在末日避难所里，最好的闺蜜为了多拿一份抗生素，在投票时把你推出去当诱饵。',
    options: [
      { key: 'A', text: '你直接把抗生素砸了，「谁都别活」', band: 'L' },
      {
        key: 'B',
        text: '你去找她理论，她哭着说「我也是没办法」，你听完转身走了，没再回头',
        band: 'M1'
      },
      { key: 'C', text: '你表面上原谅了她，但从此睡觉都睁一只眼，不再信任任何人', band: 'M2' },
      {
        key: 'D',
        text: '你把抗生素让给她，说「你活着比我活着有用」，然后独自引开感染者',
        band: 'H'
      }
    ],
    designNote: 'B 和 C 的纠结点：「我是默默离开的人，还是表面原谅但彻底封闭内心的人？」'
  },
  {
    id: 10,
    type: 'normal',
    dimension: 'order',
    scene: '后宫宫斗',
    stem: '你在后宫发现皇后私吞了各宫的月例银子，你知道说出去会被罚，不说出去姐妹们都要挨饿。',
    options: [
      { key: 'A', text: '你选择装聋作哑，「后宫的事关我屁事，我份例又不少一分」', band: 'L' },
      {
        key: 'B',
        text: '你选择先找皇后「聊聊」，暗示自己知道了，看她愿不愿意分你一杯羹',
        band: 'M1'
      },
      { key: 'C', text: '你选择收集账本和证人，等皇上选秀时一起捅出去，一击必杀', band: 'M2' },
      {
        key: 'D',
        text: '你选择在晨昏定省时直接揭发，「规矩就是规矩，今天这桩事我必须管」',
        band: 'H'
      }
    ],
    designNote: 'B 和 C 的纠结点：「我是那种先谈条件的人，还是那种收集证据等时机的人？」'
  },
  {
    id: 11,
    type: 'normal',
    dimension: 'order',
    scene: '校园职场',
    stem: '你们小组做项目汇报，deadline 前三天你发现队友的 part 全是复制粘贴的小红书攻略。',
    options: [
      { key: 'A', text: '你选择默默把他的部分重写一遍，反正看的是整体效果，懒得撕逼', band: 'L' },
      { key: 'B', text: '你选择在群里 @ 她，语气委婉地说「这部分可能需要再完善一下」', band: 'M1' },
      { key: 'C', text: '你选择把她的复制内容截图发群里，@所有人请大家评判', band: 'M2' },
      {
        key: 'D',
        text: '你直接把她的部分删掉，汇报时说「这部分有人没做，但我一个人扛了」',
        band: 'H'
      }
    ],
    designNote: 'B 和 C 的纠结点：「我是那种委婉提醒的人，还是那种公开处刑的人？」'
  },
  {
    id: 12,
    type: 'normal',
    dimension: 'endurance',
    scene: '深宅大院',
    stem: '你被嫡母陷害，从正房大小姐贬为浣衣婢，全府都在传「那个大小姐完了」。',
    options: [
      { key: 'A', text: '你躲在浣衣局三个月没出门，最后决定嫁个商户，「高门不适合我」', band: 'L' },
      {
        key: 'B',
        text: '你花了三个月适应，每天对着旧衣裳发呆，但最终还是决定从头再来',
        band: 'M1'
      },
      {
        key: 'C',
        text: '你表面上说「没事，丫鬟也挺好」，但每晚梦到从前，醒来照常洗衣',
        band: 'M2'
      },
      {
        key: 'D',
        text: '你从浣衣局爬出来，指着嫡母的院子说「再来，站得更高让你看，我命由我不由天」',
        band: 'H'
      }
    ],
    designNote: 'B 和 C 的纠结点：「我是慢慢恢复的人，还是表面没事但深夜emo的人？」'
  },
  {
    id: 13,
    type: 'normal',
    dimension: 'endurance',
    scene: '都市闺蜜',
    stem: '你被渣男劈腿，闺蜜团散了，工作也丢了。你花了三年才缓过来，发现前任要结婚了。',
    options: [
      { key: 'A', text: '你拉黑所有共同好友，在另一个城市开了间花店，「爱情不适合我」', band: 'L' },
      {
        key: 'B',
        text: '你继续参加共同好友的聚会，但每次看到他就找借口离开，三年还在原地打转',
        band: 'M1'
      },
      { key: 'C', text: '你表面上祝福他，但每晚梦到从前，醒来照常上班', band: 'M2' },
      {
        key: 'D',
        text: '你花了三年健身、升职、变美，在他婚礼那天发了条朋友圈「谢谢你放过我」',
        band: 'H'
      }
    ],
    designNote: 'B 和 C 的纠结点：「我是想走出来但一直下不了决心的人，还是表面没事但深夜emo的人？」'
  },
  {
    id: 14,
    type: 'easter',
    dimension: 'order',
    scene: '后宫宫斗',
    stem: '你知道后宫规定「晋位按资历和恩宠综合评定」，却发现贵妃偷偷塞银子，把本该属于你的位份给了她的表妹。',
    options: [
      { key: 'A', text: '你选择装作不知道，位份给谁不是给，反正你本来也没指望', band: 'L' },
      { key: 'B', text: '你也偷偷给太监塞银子，心想「大家都塞，我不塞就亏了」', band: 'M1' },
      {
        key: 'C',
        text: '你表面上按规定等晋位，但暗中记录了贵妃的所有违规操作，准备时机成熟一起举报',
        band: 'M2',
        seedTag: 'wukong'
      },
      {
        key: 'D',
        text: '你直接当着所有嫔妃的面说「规矩是给你们定的，今天这位份我按规矩重新算」',
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
    scene: '都市闺蜜',
    stem: '你被闺蜜团集体孤立，生日会上没人来，全公司都在传「那个女的没人缘」。',
    options: [
      { key: 'A', text: '你删掉所有社交软件，把蛋糕送给楼下保安，决定从此独来独往', band: 'L' },
      {
        key: 'B',
        text: '你花了三个月疗伤，每天对着空聊天框发呆，但最终还是决定主动约人',
        band: 'M1'
      },
      {
        key: 'C',
        text: '你表面上说「没事，一个人也挺好」，但每晚梦到被排挤，醒来照常化妆',
        band: 'M2',
        seedTag: 'wukong'
      },
      {
        key: 'D',
        text: '你第二天照样办了一场更大的生日会，「这条命硬得很，你们不来，我自己来」',
        band: 'H',
        seedTag: 'nezha'
      }
    ],
    designNote:
      'C 植入黑神话悟空种子（历经磨难、越战越勇），D 植入魔童哪吒种子（嚣张反骨、不服天命）。'
  }
]
