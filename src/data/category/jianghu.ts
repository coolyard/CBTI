/**
 * 江湖朝堂 题库（由 scripts/build-match-table.py 生成，禁止手改）
 */
import type { Question } from '../../types'

export const rawQuestions: Question[] = [
  {
    id: 1,
    type: 'normal',
    pair: ['presence', 'endurance'],
    scene: '江湖朝堂',
    stem: '你寒窗十年进京赶考，城门口兵士看你包袱破旧，把你拦在门外盘问了半个时辰。',
    options: [
      {
        key: 'A',
        text: '你乖乖掏出路引，问一句答一句',
        scores: { presence: 5, endurance: 2 }
      },
      {
        key: 'B',
        text: '你朗声报上名号，把荐书和行程说得滴水不漏',
        scores: { presence: 10, endurance: 9 }
      },
      {
        key: 'C',
        text: '你在城根底下铺开包袱睡了一宿，明天再排',
        scores: { presence: 1, endurance: 9 }
      },
      {
        key: 'D',
        text: '你当场赋诗一首暗讽守城兵，围观百姓哄堂叫好',
        scores: { presence: 10, endurance: 2 }
      },
      {
        key: 'E',
        text: '你排到队尾重新排，心想先进城再说',
        scores: { presence: 1, endurance: 2 }
      },
      {
        key: 'F',
        text: '你不多辩解，掏出干粮边吃边等，耗到他们换岗',
        scores: { presence: 5, endurance: 9 }
      }
    ],
    designNote: '进京第一关。B/D 纠结：「滴水不漏」vs「当场炸场」，C 是苟王流的浪漫。'
  },
  {
    id: 2,
    type: 'normal',
    pair: ['cognition', 'order'],
    scene: '江湖朝堂',
    stem: '你被分到吏部当书办，头一个月俸禄被堂官扣下一半：「新人孝敬，规矩如此。」',
    options: [
      {
        key: 'A',
        text: '你按流程向上峰递了份申诉，成不成先递了再说',
        scores: { cognition: 5, order: 9 }
      },
      {
        key: 'B',
        text: '你认了，半份俸禄也是俸禄',
        scores: { cognition: 1, order: 2 }
      },
      {
        key: 'C',
        text: '你默不作声，连夜把他账目里的窟窿整理成小册',
        scores: { cognition: 10, order: 2 }
      },
      {
        key: 'D',
        text: '你翻遍《吏部则例》找到俸禄条款，当众一条条背给他听',
        scores: { cognition: 10, order: 9 }
      },
      {
        key: 'E',
        text: '你找到老书办请教规矩，把这笔账记成「学费」',
        scores: { cognition: 1, order: 9 }
      },
      {
        key: 'F',
        text: '你忍了，但开始留意他每天见了谁、收了什么',
        scores: { cognition: 5, order: 2 }
      }
    ],
    designNote:
      '立足第一课：被克扣怎么办。C/D 纠结：「捏把柄玩大的」vs「用规则砸回去」，都是高认知但路子相反。'
  },
  {
    id: 3,
    type: 'normal',
    pair: ['emotion', 'endurance'],
    scene: '江湖朝堂',
    stem: '你发现全衙门没人正眼看你，只有同客栈的老周分了你半壶浊酒：「后生，你眼里有股劲。」',
    options: [
      {
        key: 'A',
        text: '你默默听着，第二天早起帮他劈了一担柴',
        scores: { emotion: 1, endurance: 9 }
      },
      {
        key: 'B',
        text: '你眼眶一热跟他碰了壶：「他日得志，必报此酒」',
        scores: { emotion: 10, endurance: 2 }
      },
      {
        key: 'C',
        text: '你没多说，此后每月俸禄先打半斤酒送去',
        scores: { emotion: 5, endurance: 9 }
      },
      {
        key: 'D',
        text: '你心想：套近乎的多了，他图我什么',
        scores: { emotion: 1, endurance: 2 }
      },
      {
        key: 'E',
        text: '你把这句话记在心上，决定连他的份一起挣出来',
        scores: { emotion: 10, endurance: 9 }
      },
      {
        key: 'F',
        text: '你陪他喝到半夜，听了一肚子江湖旧事',
        scores: { emotion: 5, endurance: 2 }
      }
    ],
    designNote:
      '锚点角色「老周」登场（为江湖-08/10/13 埋伏笔）。B/E 是「当场破防」，A 是「嘴硬但扛事」。'
  },
  {
    id: 4,
    type: 'normal',
    pair: ['presence', 'cognition'],
    scene: '江湖朝堂',
    stem: '你接手第一桩案子：城南灭门案，人犯早已画押。你翻卷宗翻出一处对不上的地方。',
    options: [
      {
        key: 'A',
        text: '你悄悄重查，证据凑齐前先不露声色',
        scores: { presence: 5, cognition: 9 }
      },
      {
        key: 'B',
        text: '你明面归档，暗地里把卷宗抄了一份带回家',
        scores: { presence: 1, cognition: 9 }
      },
      {
        key: 'C',
        text: '你当堂驳回画押，一句「此案有诈」惊了满堂',
        scores: { presence: 10, cognition: 2 }
      },
      {
        key: 'D',
        text: '你按部就班又审了一遍，没翻案，也没出错',
        scores: { presence: 5, cognition: 2 }
      },
      {
        key: 'E',
        text: '你连夜重验尸格重画现场，第二天带着铁证翻案',
        scores: { presence: 10, cognition: 9 }
      },
      {
        key: 'F',
        text: '你想着多一事不如少一事，画押的案子别碰',
        scores: { presence: 1, cognition: 2 }
      }
    ],
    designNote: '首次办案。C/E 纠结：「当堂炸」vs「铁证翻案」，都是高光打法，算计程度不同。'
  },
  {
    id: 5,
    type: 'normal',
    pair: ['emotion', 'order'],
    scene: '江湖朝堂',
    stem: '你翻案之后名声初起，庆功宴上上司举杯：「此案全赖本官调度有方。」',
    options: [
      {
        key: 'A',
        text: '你笑笑没说话，反正你的目标是下一桩更大的案子',
        scores: { emotion: 5, order: 2 }
      },
      {
        key: 'B',
        text: '你当众给足他面子，回头把查案手记递给了都察院',
        scores: { emotion: 10, order: 9 }
      },
      {
        key: 'C',
        text: '你无所谓，功劳又不能换酒喝',
        scores: { emotion: 1, order: 2 }
      },
      {
        key: 'D',
        text: '你私下找他：这次让您，下次功劳簿得写明白',
        scores: { emotion: 5, order: 9 }
      },
      {
        key: 'E',
        text: '你念他平日照拂，笑着敬了这杯，心里记下一笔',
        scores: { emotion: 10, order: 2 }
      },
      {
        key: 'F',
        text: '你当场按《考课法》请验功次，谁劝都没用',
        scores: { emotion: 1, order: 9 }
      }
    ],
    designNote: '承段冲突升级。E/F 是「情分」与「规矩」的极端对撞，B 是两者兼顾的高端局。'
  },
  {
    id: 6,
    type: 'normal',
    pair: ['cognition', 'endurance'],
    scene: '江湖朝堂',
    stem: '你追查案中案，夜探漕帮货仓，刚拿到暗账，火把四起，几十个刀客围了上来。',
    options: [
      {
        key: 'A',
        text: '你啥也不会，只能挨一刀挪一步，愣是挪出了包围圈',
        scores: { cognition: 1, endurance: 9 }
      },
      {
        key: 'B',
        text: '你边算退路边断后，顺走暗账还放把火搅乱追兵',
        scores: { cognition: 10, endurance: 9 }
      },
      {
        key: 'C',
        text: '你跟着墙上记号原路退回，苟到他们搜累了',
        scores: { cognition: 5, endurance: 2 }
      },
      {
        key: 'D',
        text: '你当场抱头蹲防：「大哥们，账给你们，命给我留着」',
        scores: { cognition: 1, endurance: 2 }
      },
      {
        key: 'E',
        text: '你看不懂刀路，但扛揍你在行，护着账本硬冲出去',
        scores: { cognition: 5, endurance: 9 }
      },
      {
        key: 'F',
        text: '你三个呼吸算出生门在房梁，踹窗而出，落地崴了脚',
        scores: { cognition: 10, endurance: 2 }
      }
    ],
    designNote:
      '绝境题。D 写成「怂得可爱」而非「傻子选项」；A 是笨拙但死磕，和 F 的「聪明但脆」形成镜像纠结。'
  },
  {
    id: 7,
    type: 'easter',
    pair: ['presence', 'order'],
    scene: '江湖朝堂',
    stem: '你被参「私闯禁地、擅改卷宗」，大理寺会审，主审官把惊堂木拍得山响：「认罪画押，饶你不死。」',
    options: [
      {
        key: 'A',
        text: '你打了个哈哈混过去，转头该怎么查还怎么查',
        scores: { presence: 5, order: 2 }
      },
      {
        key: 'B',
        text: '你一言不发领了罚，回头把《大周律》抄了三遍找缺口',
        scores: { presence: 1, order: 9 }
      },
      {
        key: 'C',
        text: '你一拍公案：「律是死的，我命由我不由天，这罪我不认」',
        scores: { presence: 10, order: 2 },
        seedTag: 'nezha'
      },
      {
        key: 'D',
        text: '你声音比他还大，但句句引的是《大周律》原文',
        scores: { presence: 10, order: 9 }
      },
      {
        key: 'E',
        text: '你领了二十廷杖，爬起来拍拍灰：这条命硬得很，再来',
        scores: { presence: 5, order: 9 },
        seedTag: 'wukong'
      },
      {
        key: 'F',
        text: '你当场滑跪认罪，态度好到主审都不好意思重判',
        scores: { presence: 1, order: 2 }
      }
    ],
    designNote:
      '会审压迫感拉满。C 植入哪吒气质（反骨、不认命），E 植入悟空气质（命硬、再来），都自然混在选项里。'
  },
  {
    id: 8,
    type: 'normal',
    pair: ['cognition', 'emotion'],
    scene: '江湖朝堂',
    stem: '你千算万算没算到，把你夜探货仓的路线卖给漕帮的，是老周——他换了个总镖头的位子。',
    options: [
      {
        key: 'A',
        text: '你见了他只问一句：「酒还温吗」，他当场老泪纵横',
        scores: { cognition: 5, emotion: 9 }
      },
      {
        key: 'B',
        text: '你没追究，逢人还说：「老周啊，一条好汉」',
        scores: { cognition: 1, emotion: 9 }
      },
      {
        key: 'C',
        text: '你笑了：那晚的暗账我抄了两份，他卖掉的是假的',
        scores: { cognition: 10, emotion: 2 }
      },
      {
        key: 'D',
        text: '你烧了所有信件，从此江湖独行',
        scores: { cognition: 1, emotion: 2 }
      },
      {
        key: 'E',
        text: '你早算到这一步，只是没算到心口真会疼',
        scores: { cognition: 10, emotion: 9 }
      },
      {
        key: 'F',
        text: '你立刻盘算：他这枚棋子，以后还能怎么用',
        scores: { cognition: 5, emotion: 2 }
      }
    ],
    designNote:
      '背叛题，回收江湖-03 的浊酒。C/E 纠结：「算无遗策的冷」vs「算到了还是疼」，A 是情感反杀。'
  },
  {
    id: 9,
    type: 'normal',
    pair: ['order', 'endurance'],
    scene: '江湖朝堂',
    stem: '你被判夺俸三年，贬去雁门戍边。满京城都在传「那个翻案的书办完了」。',
    options: [
      {
        key: 'A',
        text: '你连夜收拾细软准备跑路，江湖那么大',
        scores: { order: 1, endurance: 2 }
      },
      {
        key: 'B',
        text: '你嘴上认罚，每月一封密信寄回京城，雷打不动',
        scores: { order: 5, endurance: 9 }
      },
      {
        key: 'C',
        text: '你要求大理寺出具正式判文，程序一步不能少',
        scores: { order: 10, endurance: 2 }
      },
      {
        key: 'D',
        text: '你到雁门第一天就开始修墙：既来之，则安之',
        scores: { order: 1, endurance: 9 }
      },
      {
        key: 'E',
        text: '你认了，戍边也清闲，顺便倒腾点皮货生意',
        scores: { order: 5, endurance: 2 }
      },
      {
        key: 'F',
        text: '你把判文贴在床头，每天对着它多练一个时辰刀法',
        scores: { order: 10, endurance: 9 }
      }
    ],
    designNote: '谷底题。F/D 纠结：「对着耻辱练」vs「换个赛道卷」，都是高韧性，一个赌气一个务实。'
  },
  {
    id: 10,
    type: 'normal',
    pair: ['presence', 'emotion'],
    scene: '江湖朝堂',
    stem: '你在边城收到噩耗：老周被漕帮灭口，临死前托人给你捎来半壶酒。',
    options: [
      {
        key: 'A',
        text: '你没多话，每月初一往他坟头的方向敬一碗酒',
        scores: { presence: 5, emotion: 9 }
      },
      {
        key: 'B',
        text: '你连夜单骑出关，留下话：「漕帮总舵，三天后见」',
        scores: { presence: 10, emotion: 2 }
      },
      {
        key: 'C',
        text: '你什么都没说，那晚城头的灯亮到了天明',
        scores: { presence: 1, emotion: 9 }
      },
      {
        key: 'D',
        text: '你回了句「知道了」，感情的事你一向压得住',
        scores: { presence: 5, emotion: 2 }
      },
      {
        key: 'E',
        text: '你捏碎信纸：「人死账销」，继续修你的城墙',
        scores: { presence: 1, emotion: 2 }
      },
      {
        key: 'F',
        text: '你把半壶酒供在案头，对着它立誓：此仇必报',
        scores: { presence: 10, emotion: 9 }
      }
    ],
    designNote:
      '情感爆发点，锚点角色之死。B/C 纠结：「单骑宣战的莽」vs「灯亮到天明的闷」，两种深情两种表达。'
  },
  {
    id: 11,
    type: 'easter',
    pair: ['presence', 'endurance'],
    scene: '江湖朝堂',
    stem: '你熬满三年贬期，站在雁门城头看着自己布满老茧的手，想明白了一件事。',
    options: [
      {
        key: 'A',
        text: '「我不需要重回京城，我只需要比昨天多走一步」',
        scores: { presence: 5, endurance: 9 }
      },
      {
        key: 'B',
        text: '「三年怎么了。命在我手里，天就管不了我」',
        scores: { presence: 10, endurance: 2 },
        seedTag: 'nezha'
      },
      {
        key: 'C',
        text: '「算了，雁门的羊肉也不错，未必不是一种圆满」',
        scores: { presence: 1, endurance: 2 }
      },
      {
        key: 'D',
        text: '「老茧也是本钱，够我把这局棋重新再下一遍」',
        scores: { presence: 10, endurance: 9 }
      },
      {
        key: 'E',
        text: '「命硬的人不怕晚。这一局，我重新下场」',
        scores: { presence: 1, endurance: 9 },
        seedTag: 'wukong'
      },
      {
        key: 'F',
        text: '「先定个小目标，把今年的冬天熬过去再说」',
        scores: { presence: 5, endurance: 2 }
      }
    ],
    designNote:
      '谷底觉醒题。E 植入悟空气质（命硬不怕晚），B 植入哪吒气质（天管不了我），混在四个「想通了」的正常选项里。'
  },
  {
    id: 12,
    type: 'normal',
    pair: ['presence', 'cognition'],
    scene: '江湖朝堂',
    stem: '你奉诏回京重审旧案，金殿之上，当年的幕后黑手如今已是国丈，满朝文武都在看。',
    options: [
      {
        key: 'A',
        text: '你戴着斗篷上殿，判完就走，从此朝堂只有传说',
        scores: { presence: 1, cognition: 9 }
      },
      {
        key: 'B',
        text: '你中规中矩审完，判了也拱拱手，深藏功与名',
        scores: { presence: 5, cognition: 2 }
      },
      {
        key: 'C',
        text: '你呈上三年证据链，用他当年构陷你的路数当众处刑',
        scores: { presence: 10, cognition: 9 }
      },
      {
        key: 'D',
        text: '你称病退堂：复仇最好的方式，是让他这辈子够不着你',
        scores: { presence: 1, cognition: 2 }
      },
      {
        key: 'E',
        text: '你故意审满四十九天，让天下人看清他到底几斤几两',
        scores: { presence: 5, cognition: 9 }
      },
      {
        key: 'F',
        text: '你一句「此案当诛」，声震大殿，证据都懒得铺垫',
        scores: { presence: 10, cognition: 2 }
      }
    ],
    designNote: '翻案高潮。C/F 纠结：「用你的路数处刑」vs「一句当诛」，一个诛心一个爽快。'
  },
  {
    id: 13,
    type: 'normal',
    pair: ['cognition', 'emotion'],
    scene: '江湖朝堂',
    stem: '你平反昭雪之后，当年参你的主审官和害死老周的漕帮主一起来求你，在陛下面前美言几句。',
    options: [
      {
        key: 'A',
        text: '你请他们喝了顿酒把话说开，但名额推荐了别人',
        scores: { cognition: 5, emotion: 9 }
      },
      {
        key: 'B',
        text: '你回了四个字：「哪位？不熟。」',
        scores: { cognition: 1, emotion: 2 }
      },
      {
        key: 'C',
        text: '你心里早没了恨，但国法要讲：功过分开算',
        scores: { cognition: 10, emotion: 9 }
      },
      {
        key: 'D',
        text: '你让他们互相揭发，自己搬个凳子看戏',
        scores: { cognition: 5, emotion: 2 }
      },
      {
        key: 'E',
        text: '你在老周坟前倒了半壶酒：「酒是真的，仇，算了」',
        scores: { cognition: 1, emotion: 9 }
      },
      {
        key: 'F',
        text: '你笑着答应，转身把他们当年的烂账整理成了年鉴',
        scores: { cognition: 10, emotion: 2 }
      }
    ],
    designNote:
      '清算题，浊酒二次回收。C/E 纠结：「功过分开的清醒」vs「酒是真的的念旧」，都是高姿态。'
  },
  {
    id: 14,
    type: 'normal',
    pair: ['emotion', 'order'],
    scene: '江湖朝堂',
    stem: '你接到口谕：陛下要封你入阁拜相，条件是娶长公主，并永不再查军械走私案。',
    options: [
      {
        key: 'A',
        text: '你先应下来再说，以后的事以后慢慢盘',
        scores: { emotion: 5, order: 2 }
      },
      {
        key: 'B',
        text: '你当众烧了条件书：「真相不换前途，这相我不当」',
        scores: { emotion: 1, order: 9 }
      },
      {
        key: 'C',
        text: '你问的第一句话是：「公主她愿意吗」',
        scores: { emotion: 10, order: 2 }
      },
      {
        key: 'D',
        text: '你提出等价交换：案子可以不查，涉案人必须依律处置',
        scores: { emotion: 5, order: 9 }
      },
      {
        key: 'E',
        text: '你谢绝了：「相位挺好，但我的剧本我自己写」',
        scores: { emotion: 1, order: 2 }
      },
      {
        key: 'F',
        text: '你全都要：相位要接，案子要查，婚事得问当事人',
        scores: { emotion: 10, order: 9 }
      }
    ],
    designNote:
      '终极交易题。B/F 纠结：「烧书不当」vs「全都要」，C 把焦点拉回当事人，情感维度的最高级写法。'
  },
  {
    id: 15,
    type: 'normal',
    pair: ['order', 'endurance'],
    scene: '江湖朝堂',
    stem: '你告老还乡前最后一次登楼看雪，楼下百姓自发相送，你的《平冤录》刚颁行天下。',
    options: [
      {
        key: 'A',
        text: '你回头看了一眼京城的万家灯火，然后转身出城',
        scores: { order: 5, endurance: 9 }
      },
      {
        key: 'B',
        text: '你大笑着迎向风雪：「三十年都熬了，不差这一程」',
        scores: { order: 1, endurance: 9 }
      },
      {
        key: 'C',
        text: '你盯着史官把每一笔案卷誊清归档，少一页都不行',
        scores: { order: 10, endurance: 2 }
      },
      {
        key: 'D',
        text: '你往官道旁一闪钻进小酒馆：官爱谁当谁当，你要留在江湖',
        scores: { order: 1, endurance: 2 }
      },
      {
        key: 'E',
        text: '你心想办完这桩就收工，入阁也就是换个地方上班',
        scores: { order: 5, endurance: 2 }
      },
      {
        key: 'F',
        text: '你把《平冤录》颁行各州府，又亲手核了三遍才挂冠',
        scores: { order: 10, endurance: 9 }
      }
    ],
    designNote: '结局升华。F/C 是「规矩人」的极致，B 是「扛过去」，D 钻酒馆收尾扣住全篇的沙雕基调。'
  }
]
