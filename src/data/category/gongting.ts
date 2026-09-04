/**
 * 宫廷深宅后宫 题库（由 scripts/build-match-table.py 生成，禁止手改）
 */
import type { Question } from '../../types'

export const rawQuestions: Question[] = [
  {
    id: 1,
    type: 'normal',
    pair: ['presence', 'endurance'],
    scene: '宫廷深宅后宫',
    stem: '你入宫第一天，教引姑姑扫了你一眼：「报才艺。不会伺候人的，去浣衣局。」',
    options: [
      {
        key: 'A',
        text: '你心想先苟过三个月，摸清各宫脾性再说',
        scores: { presence: 5, endurance: 9 }
      },
      {
        key: 'B',
        text: '你上前一步：「琴棋书画都会，还会看账」',
        scores: { presence: 10, endurance: 2 }
      },
      {
        key: 'C',
        text: '你默默记下各宫娘娘的喜好，写成小册子',
        scores: { presence: 1, endurance: 9 }
      },
      {
        key: 'D',
        text: '你中规中矩行了个礼：「会些针线」，领了腰牌',
        scores: { presence: 5, endurance: 2 }
      },
      {
        key: 'E',
        text: '你被挤到队尾，心想浣衣局的饭也是饭',
        scores: { presence: 1, endurance: 2 }
      },
      {
        key: 'F',
        text: '你朗声报了才艺，顺手把花名册理得清清楚楚',
        scores: { presence: 10, endurance: 9 }
      }
    ],
    designNote: '入宫第一关。B/F 纠结：「上前一步」vs「报才艺兼理册」，E 认怂但理直气壮。'
  },
  {
    id: 2,
    type: 'normal',
    pair: ['cognition', 'order'],
    scene: '宫廷深宅后宫',
    stem: '你被分到尚宫局，头一个月份例被掌事姑姑扣下一半：「新人的孝敬，宫里的规矩。」',
    options: [
      {
        key: 'A',
        text: '你认了，半份例也是例',
        scores: { cognition: 1, order: 2 }
      },
      {
        key: 'B',
        text: '你按流程向内务府递了份呈文，成不成先递了',
        scores: { cognition: 5, order: 9 }
      },
      {
        key: 'C',
        text: '你转身盯上她私卖宫绸的账本，准备玩把大的',
        scores: { cognition: 10, order: 2 }
      },
      {
        key: 'D',
        text: '你找老宫女请教规矩，把这笔账记成「学费」',
        scores: { cognition: 1, order: 9 }
      },
      {
        key: 'E',
        text: '你忍了，但默默记下她每日见过谁、收过什么',
        scores: { cognition: 5, order: 2 }
      },
      {
        key: 'F',
        text: '你连夜翻遍宫规，把她的逾矩记录整理成册',
        scores: { cognition: 10, order: 9 }
      }
    ],
    designNote: '立足第一课。C/F 纠结：「捏账本玩大的」vs「用宫规砸回去」，都是高认知但路子相反。'
  },
  {
    id: 3,
    type: 'normal',
    pair: ['emotion', 'endurance'],
    scene: '宫廷深宅后宫',
    stem: '你发现满宫没人正眼看你，只有烧火的小桃偷塞给你一碟桂花糕：「姐姐，你像我们县里的菩萨。」',
    options: [
      {
        key: 'A',
        text: '你没说什么，但此后每顿都分她一半',
        scores: { emotion: 5, endurance: 9 }
      },
      {
        key: 'B',
        text: '你心想：无事献殷勤，她图我什么',
        scores: { emotion: 1, endurance: 2 }
      },
      {
        key: 'C',
        text: '你把这句话记在心上，决定连她的份一起挣',
        scores: { emotion: 10, endurance: 9 }
      },
      {
        key: 'D',
        text: '你面无表情接过，转头替她顶下了打碎碗的罪',
        scores: { emotion: 1, endurance: 9 }
      },
      {
        key: 'E',
        text: '你接过糕说了声谢，心里暖了一下，也就一下',
        scores: { emotion: 5, endurance: 2 }
      },
      {
        key: 'F',
        text: '你眼眶一热拉她坐下：「以后有我一口就有你一口」',
        scores: { emotion: 10, endurance: 2 }
      }
    ],
    designNote:
      '锚点角色「小桃」登场（桂花糕信物，为宫廷-08/10/13 埋伏笔）。F/C 是「当场破防」，D 是「嘴硬但扛事」。'
  },
  {
    id: 4,
    type: 'normal',
    pair: ['presence', 'cognition'],
    scene: '宫廷深宅后宫',
    stem: '你在赏花宴上被贵妃点名即席作诗，满座都等着看你这个新人的笑话。',
    options: [
      {
        key: 'A',
        text: '你低头装怯，实则记下每个人的衣着派系',
        scores: { presence: 1, cognition: 9 }
      },
      {
        key: 'B',
        text: '你中规中矩作完，不惊艳也不失礼',
        scores: { presence: 5, cognition: 2 }
      },
      {
        key: 'C',
        text: '你先谦让两句示弱，第三句突然封神',
        scores: { presence: 10, cognition: 9 }
      },
      {
        key: 'D',
        text: '你自称才疏学浅，把风头让给了贵妃的侄女',
        scores: { presence: 1, cognition: 2 }
      },
      {
        key: 'E',
        text: '你主打一个能耗，先听别人作完再压轴',
        scores: { presence: 5, cognition: 9 }
      },
      {
        key: 'F',
        text: '你提笔就写，艳惊四座，管他得罪谁',
        scores: { presence: 10, cognition: 2 }
      }
    ],
    designNote: '首次亮相。C/F 纠结：「谦让后封神」vs「提笔就写」，都是高光打法，算计程度不同。'
  },
  {
    id: 5,
    type: 'normal',
    pair: ['emotion', 'order'],
    scene: '宫廷深宅后宫',
    stem: '你设计的香方治好了太后的头风，请赏那天，贵妃淡淡开口：「此方是本宫让她试的。」',
    options: [
      {
        key: 'A',
        text: '你私下找她：这次让您，下次的赏得二八分',
        scores: { emotion: 5, order: 9 }
      },
      {
        key: 'B',
        text: '你无所谓，功劳又不能换炭火，活着才是正经事',
        scores: { emotion: 1, order: 2 }
      },
      {
        key: 'C',
        text: '你念着她宫中势大没拆台，但从此心里有本账',
        scores: { emotion: 10, order: 2 }
      },
      {
        key: 'D',
        text: '你当众按宫规请求查验香方来历，谁劝都没用',
        scores: { emotion: 1, order: 9 }
      },
      {
        key: 'E',
        text: '你笑笑没说话，反正你的目标是下一张更大的方子',
        scores: { emotion: 5, order: 2 }
      },
      {
        key: 'F',
        text: '你当众谢恩给足面子，回头把制香手记呈给了太后',
        scores: { emotion: 10, order: 9 }
      }
    ],
    designNote: '承段冲突升级。C/D 是「情分」与「规矩」的极端对撞，F 是两者兼顾的高端局。'
  },
  {
    id: 6,
    type: 'normal',
    pair: ['cognition', 'endurance'],
    scene: '宫廷深宅后宫',
    stem: '你随驾去行宫，夜里你住的那间暖阁突然走水，门还被人从外面锁了。',
    options: [
      {
        key: 'A',
        text: '你当场拍门大喊：「救命！赏银百两！先救我！」',
        scores: { cognition: 1, endurance: 2 }
      },
      {
        key: 'B',
        text: '你边算火势边打湿棉被断后，顺手还捞出了证物',
        scores: { cognition: 10, endurance: 9 }
      },
      {
        key: 'C',
        text: '你看不懂火势，但扛烫你在行，裹着湿被冲出火场',
        scores: { cognition: 5, endurance: 9 }
      },
      {
        key: 'D',
        text: '你啥也不会，只能用指甲抠窗缝，抠到流血也不停',
        scores: { cognition: 1, endurance: 9 }
      },
      {
        key: 'E',
        text: '你跟着烟雾反方向爬，苟到救兵赶到',
        scores: { cognition: 5, endurance: 2 }
      },
      {
        key: 'F',
        text: '你三息之内算出生路在天窗，踹窗而出，落地崴了脚',
        scores: { cognition: 10, endurance: 2 }
      }
    ],
    designNote:
      '绝境题。A 写成「怂得可爱」而非「傻子选项」；D 是笨拙但死磕，和 F 的「聪明但脆」形成镜像纠结。'
  },
  {
    id: 7,
    type: 'easter',
    pair: ['presence', 'order'],
    scene: '宫廷深宅后宫',
    stem: '你被搜出枕下藏着太后丢的东珠。贵妃端坐堂上：「人赃并获，你认是不认。」',
    options: [
      {
        key: 'A',
        text: '你打了个太极混过去，转头该怎么查还怎么查',
        scores: { presence: 5, order: 2 }
      },
      {
        key: 'B',
        text: '你声音比贵妃还冷：「拿赃来易，拿证据来」',
        scores: { presence: 10, order: 2 }
      },
      {
        key: 'C',
        text: '你磕了个头认罚，却把当值名录背得一字不差：「一日都错不了」',
        scores: { presence: 1, order: 9 },
        seedTag: 'jingwei'
      },
      {
        key: 'D',
        text: '你起身朗声：「这宫里我罩的人，天塌了我顶着，罪我不认」',
        scores: { presence: 10, order: 9 },
        seedTag: 'nuwa'
      },
      {
        key: 'E',
        text: '你领了罚，回来把宫规抄了三遍找翻案的口子',
        scores: { presence: 5, order: 9 }
      },
      {
        key: 'F',
        text: '你当场哭诉认罪，态度好到贵妃都不好意思重罚',
        scores: { presence: 1, order: 2 }
      }
    ],
    designNote:
      '会审压迫感拉满。C 植入精卫气质（认死理、一字不差），D 植入女娲气质（天塌我顶、罩着所有人）。'
  },
  {
    id: 8,
    type: 'normal',
    pair: ['cognition', 'emotion'],
    scene: '宫廷深宅后宫',
    stem: '你发现把东珠放进你枕下的是小桃——她用你的信任换了贵妃宫里的差事。',
    options: [
      {
        key: 'A',
        text: '你见了她只问一句：「桂花糕还做吗」，她当场哭了',
        scores: { cognition: 5, emotion: 9 }
      },
      {
        key: 'B',
        text: '你没追究，逢人还说：「那孩子，命苦」',
        scores: { cognition: 1, emotion: 9 }
      },
      {
        key: 'C',
        text: '你笑了：早留了一手，她放进来的那颗珠子是假的',
        scores: { cognition: 10, emotion: 2 }
      },
      {
        key: 'D',
        text: '你烧了她送的帕子，从此宫中独行',
        scores: { cognition: 1, emotion: 2 }
      },
      {
        key: 'E',
        text: '你算到她会走这一步，但没算到心这么疼',
        scores: { cognition: 10, emotion: 9 }
      },
      {
        key: 'F',
        text: '你立刻盘算：她这枚棋子，以后还能怎么用',
        scores: { cognition: 5, emotion: 2 }
      }
    ],
    designNote:
      '背叛题，回收宫廷-03 的桂花糕。C/E 纠结：「留一手的冷」vs「算到了还是疼」，A 是情感反杀。'
  },
  {
    id: 9,
    type: 'normal',
    pair: ['order', 'endurance'],
    scene: '宫廷深宅后宫',
    stem: '你被打入冷宫，份例全撤。满宫都在传「那个会调香的完了」。',
    options: [
      {
        key: 'A',
        text: '你连夜打点冷宫侍卫准备跑路，宫外的世界也很大',
        scores: { order: 1, endurance: 2 }
      },
      {
        key: 'B',
        text: '你嘴上认罚，每天半夜让老太监往外递方子',
        scores: { order: 5, endurance: 9 }
      },
      {
        key: 'C',
        text: '你要求看盖印的旨意原文，程序一步不能少',
        scores: { order: 10, endurance: 2 }
      },
      {
        key: 'D',
        text: '你到冷宫第一天就开始扫院子：既来之，则安之',
        scores: { order: 1, endurance: 9 }
      },
      {
        key: 'E',
        text: '你认了，冷宫也清闲，顺便种点香料换钱',
        scores: { order: 5, endurance: 2 }
      },
      {
        key: 'F',
        text: '你把旨意贴在床头，每天对着它多调一款香',
        scores: { order: 10, endurance: 9 }
      }
    ],
    designNote: '谷底题。F/D 纠结：「对着耻辱练」vs「换种活法卷」，都是高韧性，一个赌气一个务实。'
  },
  {
    id: 10,
    type: 'normal',
    pair: ['presence', 'emotion'],
    scene: '宫廷深宅后宫',
    stem: '你在冷宫第三年收到消息：小桃被贵妃灭口前留了句话——「枕头里的珠子，是我放的。」',
    options: [
      {
        key: 'A',
        text: '你没多话，每月初一往她家的方向供一碟糕',
        scores: { presence: 5, emotion: 9 }
      },
      {
        key: 'B',
        text: '你捏紧香杵：「三日之内，我要让贵妃亲自来冷宫」',
        scores: { presence: 10, emotion: 2 }
      },
      {
        key: 'C',
        text: '你什么都没说，那晚冷宫的灯亮到了天明',
        scores: { presence: 1, emotion: 9 }
      },
      {
        key: 'D',
        text: '你回了句「知道了」，感情的事你一向压得住',
        scores: { presence: 5, emotion: 2 }
      },
      {
        key: 'E',
        text: '你冷笑一声：「人死账销」，继续扫你的院子',
        scores: { presence: 1, emotion: 2 }
      },
      {
        key: 'F',
        text: '你对着月亮立誓：她的债我讨，小桃的冤我雪',
        scores: { presence: 10, emotion: 9 }
      }
    ],
    designNote:
      '情感爆发点，锚点角色之死。B/C 纠结：「三日宣战的烈」vs「灯亮到天明的闷」，两种深情两种表达。'
  },
  {
    id: 11,
    type: 'easter',
    pair: ['presence', 'endurance'],
    scene: '宫廷深宅后宫',
    stem: '你在冷宫墙角发现一株没人管的桂花树，活着，还开了花。你看着它想明白了一件事。',
    options: [
      {
        key: 'A',
        text: '「我不需要一步登天，我只需要比昨天多走一步」',
        scores: { presence: 5, endurance: 9 }
      },
      {
        key: 'B',
        text: '「天塌了？我来补。先补这宫里的烂人心」',
        scores: { presence: 10, endurance: 9 },
        seedTag: 'nuwa'
      },
      {
        key: 'C',
        text: '「算了，冷宫养老，也未必不是一种圆满」',
        scores: { presence: 1, endurance: 2 }
      },
      {
        key: 'D',
        text: '「这口气，我一天咽不下，就记一万天」',
        scores: { presence: 1, endurance: 9 },
        seedTag: 'jingwei'
      },
      {
        key: 'E',
        text: '「今晚就动手。三年冷宫，够本了」',
        scores: { presence: 10, endurance: 2 }
      },
      {
        key: 'F',
        text: '「先定个小目标，把明天的太阳晒了再说」',
        scores: { presence: 5, endurance: 2 }
      }
    ],
    designNote:
      '谷底觉醒题。D 植入精卫气质（记一万天），B 植入女娲气质（补天梗化用），混在四个「想通了」里。'
  },
  {
    id: 12,
    type: 'normal',
    pair: ['presence', 'cognition'],
    scene: '宫廷深宅后宫',
    stem: '你在太后寿宴献上一款「冷香」让满殿梦回故乡。贵妃脸色铁青——香方是你当年被抢的那张。',
    options: [
      {
        key: 'A',
        text: '你蒙着面纱献香，献完就走，从此宫中只有传说',
        scores: { presence: 1, cognition: 9 }
      },
      {
        key: 'B',
        text: '你中规中矩献完香，谢恩退下，深藏功与名',
        scores: { presence: 5, cognition: 2 }
      },
      {
        key: 'C',
        text: '你用她当年抢你香方的路数，一步步引她自己认',
        scores: { presence: 10, cognition: 9 }
      },
      {
        key: 'D',
        text: '你托病没去：复仇最好的方式，是让她夜夜睡不着',
        scores: { presence: 1, cognition: 2 }
      },
      {
        key: 'E',
        text: '你故意让香气绕梁三日，让满宫看清她的斤两',
        scores: { presence: 5, cognition: 9 }
      },
      {
        key: 'F',
        text: '你一句「此香名唤『珠还』」，当众揭开旧案',
        scores: { presence: 10, cognition: 2 }
      }
    ],
    designNote: '翻案高潮。C/F 纠结：「引她自己认」vs「当众揭案」，一个诛心一个爽快。'
  },
  {
    id: 13,
    type: 'normal',
    pair: ['cognition', 'emotion'],
    scene: '宫廷深宅后宫',
    stem: '你重掌尚宫局之后，当年搜你宫的首领太监和落井下石的姑姑一起来求你，在太后面前美言几句。',
    options: [
      {
        key: 'A',
        text: '你笑着答应，转身把他们当年的烂账整理成了《宫闱年鉴》',
        scores: { cognition: 10, emotion: 2 }
      },
      {
        key: 'B',
        text: '你请他们喝了盏茶把话说开，但名额推荐了别人',
        scores: { cognition: 5, emotion: 9 }
      },
      {
        key: 'C',
        text: '你终究放过了小桃的族人：「那碟桂花糕是真的」',
        scores: { cognition: 1, emotion: 9 }
      },
      {
        key: 'D',
        text: '你心里早没了恨，但宫规要讲：功过分开算',
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
      '清算题，桂花糕二次回收。D/C 纠结：「功过分开的清醒」vs「桂花糕是真的的念旧」，都是高姿态。'
  },
  {
    id: 14,
    type: 'normal',
    pair: ['emotion', 'order'],
    scene: '宫廷深宅后宫',
    stem: '你收到立后的口谕，条件是养废太子、认养贵妃之子，并永不再查东珠案幕后。',
    options: [
      {
        key: 'A',
        text: '你先应下来再说，以后的事以后慢慢盘',
        scores: { emotion: 5, order: 2 }
      },
      {
        key: 'B',
        text: '你当众烧了条件书：「真相不换凤冠，这后我不当」',
        scores: { emotion: 1, order: 9 }
      },
      {
        key: 'C',
        text: '你问的第一句话是：「孩子们自己愿意吗」',
        scores: { emotion: 10, order: 2 }
      },
      {
        key: 'D',
        text: '你提出等价交换：案子可以不查，涉案人必须依律处置',
        scores: { emotion: 5, order: 9 }
      },
      {
        key: 'E',
        text: '你谢绝了：「后位挺好，但我的剧本我自己写」',
        scores: { emotion: 1, order: 2 }
      },
      {
        key: 'F',
        text: '你全都要：后位要坐，案子要查，婚事得问当事人',
        scores: { emotion: 10, order: 9 }
      }
    ],
    designNote:
      '终极交易题。B/F 纠结：「烧书不当」vs「全都要」，C 把焦点拉回孩子，情感维度的最高级写法。'
  },
  {
    id: 15,
    type: 'normal',
    pair: ['order', 'endurance'],
    scene: '宫廷深宅后宫',
    stem: '你垂帘的第一年，新政颁行，宫女皆可年满出宫。这夜你独自登上角楼，看满城灯火。',
    options: [
      {
        key: 'A',
        text: '你回头看了一眼冷宫的方向，然后转身下楼',
        scores: { order: 5, endurance: 9 }
      },
      {
        key: 'B',
        text: '你迎着风张开袖子：「三十年都熬了，不差这一程」',
        scores: { order: 1, endurance: 9 }
      },
      {
        key: 'C',
        text: '你盯着女史把新政每一条誊清颁行，少一条都不行',
        scores: { order: 10, endurance: 2 }
      },
      {
        key: 'D',
        text: '你心想忙完这阵就收工，垂帘也就是换个地方批折子',
        scores: { order: 5, endurance: 2 }
      },
      {
        key: 'E',
        text: '你往角楼里一躲：折子爱谁批谁批，你要卡 bug 休年假',
        scores: { order: 1, endurance: 2 }
      },
      {
        key: 'F',
        text: '你把新政推行到最后一道宫门，亲手核了三遍',
        scores: { order: 10, endurance: 9 }
      }
    ],
    designNote: '结局升华。F/C 是「规矩人」的极致，B 是「扛过去」，E 躲角楼收尾扣住全篇的沙雕基调。'
  }
]
