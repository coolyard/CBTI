/**
 * 热血校园竞技 题库（由 scripts/build-match-table.py 生成，禁止手改）
 */
import type { Question } from '../../types'

export const rawQuestions: Question[] = [
  {
    id: 1,
    type: 'normal',
    pair: ['presence', 'endurance'],
    scene: '热血校园竞技',
    stem: '你高二转学来这所篮球名校，新生测试赛，全校的目光都钉在你这个转学生身上。',
    options: [
      {
        key: 'A',
        text: '你心想先苟进大名单，决赛圈再亮底牌',
        scores: { presence: 5, endurance: 9 }
      },
      {
        key: 'B',
        text: '你上场第一球就隔扣了队长，落地环视全场',
        scores: { presence: 10, endurance: 2 }
      },
      {
        key: 'C',
        text: '你默默把每个对手的习惯动作记了满满一本',
        scores: { presence: 1, endurance: 9 }
      },
      {
        key: 'D',
        text: '你中规中矩跑完战术，不抢眼也不犯错',
        scores: { presence: 5, endurance: 2 }
      },
      {
        key: 'E',
        text: '你被断球后悻悻下场，认了：饮水机也是一种位置',
        scores: { presence: 1, endurance: 2 }
      },
      {
        key: 'F',
        text: '你独得三十分还送了十个助攻，数据和场面全要',
        scores: { presence: 10, endurance: 9 }
      }
    ],
    designNote: '转校首秀。B/F 纠结：「隔扣炸场」vs「数据全要」，E 是认怂但自我安慰得理直气壮。'
  },
  {
    id: 2,
    type: 'normal',
    pair: ['cognition', 'order'],
    scene: '热血校园竞技',
    stem: '你发现球队资源按资历分，你被排到最破的训练时段：早上五点，馆里没暖气。',
    options: [
      {
        key: 'A',
        text: '你认了，五点就五点，总比没场练强',
        scores: { cognition: 1, order: 2 }
      },
      {
        key: 'B',
        text: '你找教练按流程申诉，哪怕没用也要留个案底',
        scores: { cognition: 5, order: 9 }
      },
      {
        key: 'C',
        text: '你研究了校规，找到场地分配漏洞，准备玩把大的',
        scores: { cognition: 10, order: 2 }
      },
      {
        key: 'D',
        text: '你五点准时到馆，心想暖气没有，汗水有',
        scores: { cognition: 1, order: 9 }
      },
      {
        key: 'E',
        text: '你忍了，但默默记下谁几点用了哪块场',
        scores: { cognition: 5, order: 2 }
      },
      {
        key: 'F',
        text: '你连夜翻遍校纪和赞助合同，把违规记录整理成册',
        scores: { cognition: 10, order: 9 }
      }
    ],
    designNote:
      '立足第一课。C/F 纠结：「钻漏洞玩大的」vs「用规则砸回去」；D 是低认知高规矩的憨直写法。'
  },
  {
    id: 3,
    type: 'normal',
    pair: ['emotion', 'endurance'],
    scene: '热血校园竞技',
    stem: '你发现全队没人传球给你，只有守了三年饮水机的老高扔给你一只护腕：「小子，你身上有股劲。」',
    options: [
      {
        key: 'A',
        text: '你没说什么，但此后每天加练一小时，做给他看',
        scores: { emotion: 5, endurance: 9 }
      },
      {
        key: 'B',
        text: '你心想：他怕不是想蹭我的新球鞋',
        scores: { emotion: 1, endurance: 2 }
      },
      {
        key: 'C',
        text: '你把这句话写进训练日记首页，连他的份一起练',
        scores: { emotion: 10, endurance: 9 }
      },
      {
        key: 'D',
        text: '你面无表情接过，转头替他挡下了裁员名单',
        scores: { emotion: 1, endurance: 9 }
      },
      {
        key: 'E',
        text: '你接过护腕说了声谢，心里热了一下，也就一下',
        scores: { emotion: 5, endurance: 2 }
      },
      {
        key: 'F',
        text: '你红着眼眶戴上护腕：「等我打上首发，球权分你一半」',
        scores: { emotion: 10, endurance: 2 }
      }
    ],
    designNote:
      '锚点角色「老高」登场（护腕信物，为热血-08/10/13 埋伏笔）。F/C 是「当场破防」，D 是「嘴硬但扛事」。'
  },
  {
    id: 4,
    type: 'normal',
    pair: ['presence', 'cognition'],
    scene: '热血校园竞技',
    stem: '你在联赛首战临危受命：队长伤退，你这个替补对上去年 MVP，全场嘘声。',
    options: [
      {
        key: 'A',
        text: '你开局就蹲底角当工具人，实则记下他每个习惯',
        scores: { presence: 1, cognition: 9 }
      },
      {
        key: 'B',
        text: '你中规中矩打完，输了也谢了个漂亮的场',
        scores: { presence: 5, cognition: 2 }
      },
      {
        key: 'C',
        text: '你先送两个失误示弱，第三节掏出藏了三个月的绝活',
        scores: { presence: 10, cognition: 9 }
      },
      {
        key: 'D',
        text: '你研究了盘口，含泪把零花钱押了对面',
        scores: { presence: 1, cognition: 2 }
      },
      {
        key: 'E',
        text: '你主打一个能耗，把他拖到腿软再慢慢收拾',
        scores: { presence: 5, cognition: 9 }
      },
      {
        key: 'F',
        text: '你开场就迎着 MVP 强吃，球进灯亮，帅不过三节',
        scores: { presence: 10, cognition: 2 }
      }
    ],
    designNote: '首次登场。C/F 纠结：「示弱藏绝活」vs「开场就硬吃」，都是高光打法，算计程度不同。'
  },
  {
    id: 5,
    type: 'normal',
    pair: ['emotion', 'order'],
    scene: '热血校园竞技',
    stem: '你带队逆转赢了球，赛后采访，队长复出第一句话：「这场胜利，指挥是我。」',
    options: [
      {
        key: 'A',
        text: '你私下找他：这次让你，下次首发位置按数据说话',
        scores: { emotion: 5, order: 9 }
      },
      {
        key: 'B',
        text: '你无所谓，功劳又不能换球鞋，训练才是正经事',
        scores: { emotion: 1, order: 2 }
      },
      {
        key: 'C',
        text: '你念着他是队长没拆台，但从此心里有本账',
        scores: { emotion: 10, order: 2 }
      },
      {
        key: 'D',
        text: '你当场拿出技术统计要求更正报道，谁劝都没用',
        scores: { emotion: 1, order: 9 }
      },
      {
        key: 'E',
        text: '你笑笑没说话，反正你的目标是下一场更强的队',
        scores: { emotion: 5, order: 2 }
      },
      {
        key: 'F',
        text: '你当众给足他面子，回头把录像和数据发给教练组',
        scores: { emotion: 10, order: 9 }
      }
    ],
    designNote: '承段冲突升级。C/D 是「情分」与「规矩」的极端对撞，F 是两者兼顾的高端局。'
  },
  {
    id: 6,
    type: 'normal',
    pair: ['cognition', 'endurance'],
    scene: '热血校园竞技',
    stem: '你在半决赛对上死敌学校，对方使坏垫脚，你脚踝肿成馒头，裁判视而不见。',
    options: [
      {
        key: 'A',
        text: '你示意教练换人，留得青山在',
        scores: { cognition: 5, endurance: 2 }
      },
      {
        key: 'B',
        text: '你啥也不会，只能一瘸一拐地追，追到他心虚为止',
        scores: { cognition: 1, endurance: 9 }
      },
      {
        key: 'C',
        text: '你边算对面套路边咬牙打满全场，还顺走胜利',
        scores: { cognition: 10, endurance: 9 }
      },
      {
        key: 'D',
        text: '你看不懂他的坏招，但扛疼你在行，绑紧鞋带继续冲',
        scores: { cognition: 5, endurance: 9 }
      },
      {
        key: 'E',
        text: '你当场坐下抱着脚：「担架！快！记得拍帅点」',
        scores: { cognition: 1, endurance: 2 }
      },
      {
        key: 'F',
        text: '你三秒内算清裁判尺度，反手造他一个技术犯规',
        scores: { cognition: 10, endurance: 2 }
      }
    ],
    designNote: '黑哨绝境题。E 怂得可爱；B 是笨拙但死磕，和 F 的「聪明但脆」形成镜像纠结。'
  },
  {
    id: 7,
    type: 'easter',
    pair: ['presence', 'order'],
    scene: '热血校园竞技',
    stem: '你带伤赢球却被举报「服用禁药」，校听证会要你当场认错退赛，不然就开除队籍。',
    options: [
      {
        key: 'A',
        text: '你打个哈哈混过去，转头该怎么练还怎么练',
        scores: { presence: 5, order: 2 }
      },
      {
        key: 'B',
        text: '你一拍桌子：「报告是死的，我命由我不由天，这错我不认」',
        scores: { presence: 10, order: 2 },
        seedTag: 'nezha'
      },
      {
        key: 'C',
        text: '你一言不发领了罚，回来把听证会录音整理成材料',
        scores: { presence: 1, order: 9 }
      },
      {
        key: 'D',
        text: '你声音比委员还大，但句句引的是反兴奋剂条例',
        scores: { presence: 10, order: 9 }
      },
      {
        key: 'E',
        text: '你认了禁赛，回去把训练表重新排一遍：这条腿硬得很，再来',
        scores: { presence: 5, order: 9 },
        seedTag: 'wukong'
      },
      {
        key: 'F',
        text: '你当场鞠躬认错，态度好到委员都不好意思重罚',
        scores: { presence: 1, order: 2 }
      }
    ],
    designNote: '听证会压迫感拉满。B 植入哪吒气质（反骨、不认命），E 植入悟空气质（命硬、再来）。'
  },
  {
    id: 8,
    type: 'normal',
    pair: ['cognition', 'emotion'],
    scene: '热血校园竞技',
    stem: '你发现举报信里附着你更衣柜的照片——能拍到的只有老高，他换了死敌学校的特招推荐。',
    options: [
      {
        key: 'A',
        text: '你没追究，逢人还夸他：「老高啊，有前途」',
        scores: { cognition: 1, emotion: 9 }
      },
      {
        key: 'B',
        text: '你立刻盘算：他这枚棋子，以后还能怎么用',
        scores: { cognition: 5, emotion: 2 }
      },
      {
        key: 'C',
        text: '你算到他会走这一步，但没算到心这么疼',
        scores: { cognition: 10, emotion: 9 }
      },
      {
        key: 'D',
        text: '你拉黑删除一气呵成，球场上从此独行',
        scores: { cognition: 1, emotion: 2 }
      },
      {
        key: 'E',
        text: '你见了他只问一句：「护腕还要吗」，他当场哭了',
        scores: { cognition: 5, emotion: 9 }
      },
      {
        key: 'F',
        text: '你笑了：柜子里的维生素我早换成了糖豆，化验单在此',
        scores: { cognition: 10, emotion: 2 }
      }
    ],
    designNote:
      '背叛题，回收热血-03 的护腕。F/C 纠结：「留一手的冷」vs「算到了还是疼」，E 是情感反杀。'
  },
  {
    id: 9,
    type: 'normal',
    pair: ['order', 'endurance'],
    scene: '热血校园竞技',
    stem: '你被禁赛半年，伤还没好利索。全校都在传「那个转学生废了」，训练馆再没你的位置。',
    options: [
      {
        key: 'A',
        text: '你嘴上认罚，每天半夜溜进球馆加练',
        scores: { order: 5, endurance: 9 }
      },
      {
        key: 'B',
        text: '你连夜联系转学，外面的联赛也很大',
        scores: { order: 1, endurance: 2 }
      },
      {
        key: 'C',
        text: '你要求校方出具正式处分文件，程序正义一步不能少',
        scores: { order: 10, endurance: 2 }
      },
      {
        key: 'D',
        text: '你被赶到田径场第一天就开始跑圈：既来之，则卷之',
        scores: { order: 1, endurance: 9 }
      },
      {
        key: 'E',
        text: '你认了，看饮水机也清闲，顺便卖卖能量饮料',
        scores: { order: 5, endurance: 2 }
      },
      {
        key: 'F',
        text: '你把处分书贴在更衣柜，每天对着它多投两百个球',
        scores: { order: 10, endurance: 9 }
      }
    ],
    designNote: '谷底题。F/D 纠结：「对着耻辱练」vs「换个赛道卷」，都是高韧性，一个赌气一个务实。'
  },
  {
    id: 10,
    type: 'normal',
    pair: ['presence', 'emotion'],
    scene: '热血校园竞技',
    stem: '你在禁赛期第三个月收到消息：老高在死敌队被榨干利用完，膝盖废了，被直接除名。',
    options: [
      {
        key: 'A',
        text: '你什么都没回，只是把那只护腕重新系紧了一格',
        scores: { presence: 1, emotion: 9 }
      },
      {
        key: 'B',
        text: '你回了句「哦」，感情的事你一向随缘',
        scores: { presence: 5, emotion: 2 }
      },
      {
        key: 'C',
        text: '你带着护腕去看他：「养好伤，决赛看台给你留座」',
        scores: { presence: 10, emotion: 9 }
      },
      {
        key: 'D',
        text: '你冷笑一声：「下一个更乖」，继续你的折返跑',
        scores: { presence: 1, emotion: 2 }
      },
      {
        key: 'E',
        text: '你回了三个字「等着我」，然后开始玩命复健',
        scores: { presence: 10, emotion: 2 }
      },
      {
        key: 'F',
        text: '你没多话，每天一条复健打卡，雷打不动',
        scores: { presence: 5, emotion: 9 }
      }
    ],
    designNote: '情感爆发点。E/A 纠结：「玩命复健的燃」vs「系紧护腕的闷」，两种深情两种表达。'
  },
  {
    id: 11,
    type: 'easter',
    pair: ['presence', 'endurance'],
    scene: '热血校园竞技',
    stem: '你熬满禁赛期，弹跳掉了十公分。站在空荡荡的球馆里，你想明白了一件事。',
    options: [
      {
        key: 'A',
        text: '「我不需要重回巅峰，我只需要比昨天多进一个球」',
        scores: { presence: 5, endurance: 9 }
      },
      {
        key: 'B',
        text: '「腿可以废，人不能废。从头再来就从头再来」',
        scores: { presence: 1, endurance: 9 },
        seedTag: 'wukong'
      },
      {
        key: 'C',
        text: '「算了，看一辈子饮水机，也未必不是一种圆满」',
        scores: { presence: 1, endurance: 2 }
      },
      {
        key: 'D',
        text: '「十公分怎么了，够我把基本功再练一万遍」',
        scores: { presence: 10, endurance: 9 }
      },
      {
        key: 'E',
        text: '「十公分算什么。命在我手里，裁判也管不了我」',
        scores: { presence: 10, endurance: 2 },
        seedTag: 'nezha'
      },
      {
        key: 'F',
        text: '「先定个小目标，把明天的早训跑完再说」',
        scores: { presence: 5, endurance: 2 }
      }
    ],
    designNote:
      '谷底觉醒题。B 植入悟空气质（命硬、再来），E 植入哪吒气质（裁判也管不了我），混在四个「想通了」里。'
  },
  {
    id: 12,
    type: 'normal',
    pair: ['presence', 'cognition'],
    scene: '热血校园竞技',
    stem: '你站上全国大赛决赛场，对上当年那个 MVP 和死敌全队，直播镜头正对着你。',
    options: [
      {
        key: 'A',
        text: '你故意打满加时，让所有人看清他们到底几斤几两',
        scores: { presence: 5, cognition: 9 }
      },
      {
        key: 'B',
        text: '你申请轮休：复仇最好的方式，是让他这辈子够不着你',
        scores: { presence: 1, cognition: 2 }
      },
      {
        key: 'C',
        text: '你一球扣碎篮板，赢得毫无技巧，全是感情',
        scores: { presence: 10, cognition: 2 }
      },
      {
        key: 'D',
        text: '你戴上口罩参赛，打完就走，从此篮坛只有传说',
        scores: { presence: 1, cognition: 9 }
      },
      {
        key: 'E',
        text: '你每一步都在复刻他当年赢你的路数，当众处刑',
        scores: { presence: 10, cognition: 9 }
      },
      {
        key: 'F',
        text: '你中规中矩打赢了，握个手下场，深藏功与名',
        scores: { presence: 5, cognition: 2 }
      }
    ],
    designNote: '复仇高潮。E/C 纠结：「用你的路数赢你」vs「扣碎篮板」，一个诛心一个爽快。'
  },
  {
    id: 13,
    type: 'normal',
    pair: ['cognition', 'emotion'],
    scene: '热血校园竞技',
    stem: '你夺冠封神之后，当年举报你的听证委员和被除名的老高一起来求你，在教练面前美言几句。',
    options: [
      {
        key: 'A',
        text: '你笑着答应，转身把他们当年的烂事整理成了赛季报告',
        scores: { cognition: 10, emotion: 2 }
      },
      {
        key: 'B',
        text: '你请他们吃了顿饭把话说开，但名额推荐了别人',
        scores: { cognition: 5, emotion: 9 }
      },
      {
        key: 'C',
        text: '你还是替老高说了情：「当年的护腕是真的」',
        scores: { cognition: 1, emotion: 9 }
      },
      {
        key: 'D',
        text: '你心里早没了恨，但规矩要讲：功过分开算',
        scores: { cognition: 10, emotion: 9 }
      },
      {
        key: 'E',
        text: '你回了四个字：「哪位？不熟。」',
        scores: { cognition: 1, emotion: 2 }
      },
      {
        key: 'F',
        text: '你让他们互相推荐，自己搬个凳子看戏',
        scores: { cognition: 5, emotion: 2 }
      }
    ],
    designNote:
      '清算题，护腕二次回收。D/C 纠结：「功过分开的清醒」vs「护腕是真的的念旧」，都是高姿态。'
  },
  {
    id: 14,
    type: 'normal',
    pair: ['emotion', 'order'],
    scene: '热血校园竞技',
    stem: '你收到职业队合同：年薪百万，条件是签十年长约，并声明当年的禁赛是你咎由自取。',
    options: [
      {
        key: 'A',
        text: '你先应下来再说，以后的事以后慢慢盘',
        scores: { emotion: 5, order: 2 }
      },
      {
        key: 'B',
        text: '你当众撕了条件书：「真相不换前途，这字我不签」',
        scores: { emotion: 1, order: 9 }
      },
      {
        key: 'C',
        text: '你问的第一句话是：「我的队友能一起签吗」',
        scores: { emotion: 10, order: 2 }
      },
      {
        key: 'D',
        text: '你提出等价交换：声明可以发，但校方必须先平反',
        scores: { emotion: 5, order: 9 }
      },
      {
        key: 'E',
        text: '你谢绝了：「合同挺好，但我的剧本我自己写」',
        scores: { emotion: 1, order: 2 }
      },
      {
        key: 'F',
        text: '你全都要：合同要签，真相要说，条款得重新谈',
        scores: { emotion: 10, order: 9 }
      }
    ],
    designNote:
      '终极交易题。B/F 纠结：「撕了不签」vs「全都要」，C 把焦点拉回队友，情感维度的最高级写法。'
  },
  {
    id: 15,
    type: 'normal',
    pair: ['order', 'endurance'],
    scene: '热血校园竞技',
    stem: '你带校队完成三连冠，最后一场终场哨响前两秒，你持球站在三分线外，全场起立。',
    options: [
      {
        key: 'A',
        text: '你带球迎上去：「三年都扛了，不差这两秒」',
        scores: { order: 1, endurance: 9 }
      },
      {
        key: 'B',
        text: '你回头看了一眼替补席的老高，然后迎了上去',
        scores: { order: 5, endurance: 9 }
      },
      {
        key: 'C',
        text: '你示意暂停重新画战术：最后一攻，必须按布置跑',
        scores: { order: 10, endurance: 2 }
      },
      {
        key: 'D',
        text: '你心想投完这球就收工，夺冠也就是换个地方训练',
        scores: { order: 5, endurance: 2 }
      },
      {
        key: 'E',
        text: '你把球往天上一抛：冠军爱谁谁，你要卡 bug 留一级',
        scores: { order: 1, endurance: 2 }
      },
      {
        key: 'F',
        text: '你把最后一攻的每个环节按训练跑完，球进灯亮',
        scores: { order: 10, endurance: 9 }
      }
    ],
    designNote: '结局升华。F/C 是「规矩人」的极致，A 是「扛过去」，E 抛球收尾扣住全篇的沙雕基调。'
  }
]
