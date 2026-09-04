/**
 * 修仙宗门 题库（由 scripts/build-match-table.py 生成，禁止手改）
 */
import type { Question } from '../../types'

export const rawQuestions: Question[] = [
  {
    id: 1,
    type: 'normal',
    pair: ['presence', 'endurance'],
    scene: '修仙宗门',
    stem: '你穿越成宗门的外门弟子，今天测灵根大典，全宗上下都在围观新弟子亮相。',
    options: [
      {
        key: 'A',
        text: '你测出天灵根，当场放话：「三年后宗门大比，第一名我预定了」',
        scores: { presence: 10, endurance: 9 }
      },
      {
        key: 'B',
        text: '你测出伪灵根，顺势认领了扫地杂役的岗位',
        scores: { presence: 1, endurance: 2 }
      },
      {
        key: 'C',
        text: '你测出天灵根，然后当众问长老：「包吃住吗」',
        scores: { presence: 10, endurance: 2 }
      },
      {
        key: 'D',
        text: '你测出中等偏上，心想先苟到决赛圈再说',
        scores: { presence: 5, endurance: 9 }
      },
      {
        key: 'E',
        text: '你测出废灵根，暗下决心把基础功法练一万遍',
        scores: { presence: 1, endurance: 9 }
      },
      {
        key: 'F',
        text: '你测出中等灵根，鞠了个躬就退回去了',
        scores: { presence: 5, endurance: 2 }
      }
    ],
    designNote:
      '修仙文最大公约数开场。纠结点：「天灵根问包吃住」和「废灵根练一万遍」一个是开局炸场一个是苟王流，都有爽点。'
  },
  {
    id: 2,
    type: 'normal',
    pair: ['cognition', 'order'],
    scene: '修仙宗门',
    stem: '你去领月例，执事堂只给了你一半灵石：「外门弟子就这个价」。',
    options: [
      {
        key: 'A',
        text: '你忍了，但默默记下执事的长相和值岗表',
        scores: { cognition: 5, order: 2 }
      },
      {
        key: 'B',
        text: '你转身盯上执事堂的对账漏洞，准备玩把大的',
        scores: { cognition: 10, order: 2 }
      },
      {
        key: 'C',
        text: '你找到管事长老如实上报，哪怕没用也要留个案底',
        scores: { cognition: 1, order: 9 }
      },
      {
        key: 'D',
        text: '你连夜翻遍《宗门戒律》，把执事的违规记录整理成册',
        scores: { cognition: 10, order: 9 }
      },
      {
        key: 'E',
        text: '你揣着一半灵石走了，心想总比没有强',
        scores: { cognition: 1, order: 2 }
      },
      {
        key: 'F',
        text: '你去执事堂门口，委婉地背诵了三条门规',
        scores: { cognition: 5, order: 9 }
      }
    ],
    designNote:
      '立足第一课：被克扣怎么办。B/D 纠结：「钻漏洞玩大的」vs「用规则砸回去」，都是高认知但路子相反。'
  },
  {
    id: 3,
    type: 'normal',
    pair: ['emotion', 'endurance'],
    scene: '修仙宗门',
    stem: '你发现全宗只有一个小师弟搭理你。今天他捧着烤红薯来找你：「师兄，我觉得你不是池中之物。」',
    options: [
      {
        key: 'A',
        text: '你面无表情接过红薯，转头替他挡下了追债的外门师兄',
        scores: { emotion: 1, endurance: 9 }
      },
      {
        key: 'B',
        text: '你眼眶一热，把红薯掰一大半给他：「以后有我一口就有你一口」',
        scores: { emotion: 10, endurance: 2 }
      },
      {
        key: 'C',
        text: '你没说什么，但此后每天多练一个时辰，给他做个榜样',
        scores: { emotion: 5, endurance: 9 }
      },
      {
        key: 'D',
        text: '你心想：这小子怕不是想蹭我的洞府灵气',
        scores: { emotion: 1, endurance: 2 }
      },
      {
        key: 'E',
        text: '你把这句话记在小本本上，决定护他一辈子',
        scores: { emotion: 10, endurance: 9 }
      },
      {
        key: 'F',
        text: '你接过红薯说了声谢，心里暖了一下，也就一下',
        scores: { emotion: 5, endurance: 2 }
      }
    ],
    designNote:
      '锚点角色「小师弟」登场（为修仙-08/13 埋伏笔）。A 是「嘴硬但扛事」，B/E 是「当场破防」，纠结点是情感的表达方式而非有无。'
  },
  {
    id: 4,
    type: 'normal',
    pair: ['presence', 'cognition'],
    scene: '修仙宗门',
    stem: '你在宗门小比一路苟进八强，下一场对阵内门天才，全场都来看你笑话。',
    options: [
      {
        key: 'A',
        text: '你研究了本场赔率，押了自己输，含泪赚了一笔',
        scores: { presence: 1, cognition: 2 }
      },
      {
        key: 'B',
        text: '你中规中矩打完，输了也鞠了个漂亮的躬',
        scores: { presence: 5, cognition: 2 }
      },
      {
        key: 'C',
        text: '你上来先送两招示弱，第三招掏出藏了三个月的杀招',
        scores: { presence: 10, cognition: 9 }
      },
      {
        key: 'D',
        text: '你开场就放大招，绚烂夺目，三招之后灵力见底',
        scores: { presence: 10, cognition: 2 }
      },
      {
        key: 'E',
        text: '你开局就躺平认怂，实则在记下他每一招的路数',
        scores: { presence: 1, cognition: 9 }
      },
      {
        key: 'F',
        text: '你主打一个能耗，把对方拖到灵力见底再慢慢磨',
        scores: { presence: 5, cognition: 9 }
      }
    ],
    designNote:
      '首次当众亮相。C/D 纠结：「藏三个月杀招」vs「开场就炸」，都是高光打法，算计程度不同。'
  },
  {
    id: 5,
    type: 'normal',
    pair: ['emotion', 'order'],
    scene: '修仙宗门',
    stem: '你带队剿了后山妖兽，论功行赏时，领队师兄把你的战功全算在了自己头上。',
    options: [
      {
        key: 'A',
        text: '你私下找他谈：这次让你，下次战利品三七分',
        scores: { emotion: 5, order: 9 }
      },
      {
        key: 'B',
        text: '你当场按门规第三条要求重新核验战功，谁劝都没用',
        scores: { emotion: 1, order: 9 }
      },
      {
        key: 'C',
        text: '你念在同门情分没撕破脸，但从此心里有本账',
        scores: { emotion: 10, order: 2 }
      },
      {
        key: 'D',
        text: '你笑笑没说话，反正你的目标是下一个更大的功劳',
        scores: { emotion: 5, order: 2 }
      },
      {
        key: 'E',
        text: '你当众给足他面子，回头把功劳簿证据链交给了戒律堂',
        scores: { emotion: 10, order: 9 }
      },
      {
        key: 'F',
        text: '你无所谓，功劳又不能换灵石，摸鱼才是正经事',
        scores: { emotion: 1, order: 2 }
      }
    ],
    designNote: '承段冲突升级。B/C 是「规矩」与「情分」的极端对撞，E 是两者兼顾的高端局，纠结感强。'
  },
  {
    id: 6,
    type: 'normal',
    pair: ['cognition', 'endurance'],
    scene: '修仙宗门',
    stem: '你随小队深入秘境三天，灵药没找到，反而触发了上古禁制。',
    options: [
      {
        key: 'A',
        text: '你边推演边断后，最后一个出来，顺手还薅了株灵药',
        scores: { cognition: 10, endurance: 9 }
      },
      {
        key: 'B',
        text: '你当场蹲下抱头：「别管我，你们先走，记得给我烧纸」',
        scores: { cognition: 1, endurance: 2 }
      },
      {
        key: 'C',
        text: '你啥也不会，只能一遍遍试，石头砸到头破血流也不停',
        scores: { cognition: 1, endurance: 9 }
      },
      {
        key: 'D',
        text: '你三息之内推演出禁制生门，带队丝血逃出，出来腿都是软的',
        scores: { cognition: 10, endurance: 2 }
      },
      {
        key: 'E',
        text: '你看不懂禁制，但扛伤害你在行，顶着落石护住全队',
        scores: { cognition: 5, endurance: 9 }
      },
      {
        key: 'F',
        text: '你跟着队里最稳的人走，苟到禁制自己停了',
        scores: { cognition: 5, endurance: 2 }
      }
    ],
    designNote:
      '绝境题。B 写成「怂得可爱」而非「傻子选项」；C 是笨拙但死磕，和 D 的「聪明但脆」形成镜像纠结。'
  },
  {
    id: 7,
    type: 'easter',
    pair: ['presence', 'order'],
    scene: '修仙宗门',
    stem: '你被戒律堂传唤，罪名是「目无尊长、私改功法」。长老拍着桌子要你当场认罪。',
    options: [
      {
        key: 'A',
        text: '你打了个哈哈混过去，转头该怎么练还怎么练',
        scores: { presence: 5, order: 2 }
      },
      {
        key: 'B',
        text: '你一拍桌子：「规矩是死的，我命由我不由天，这罪我不认」',
        scores: { presence: 10, order: 2 },
        seedTag: 'nezha'
      },
      {
        key: 'C',
        text: '你一言不发领了罚，回来把《宗门戒律》抄了三遍找漏洞',
        scores: { presence: 1, order: 9 }
      },
      {
        key: 'D',
        text: '你声音比长老还大，但句句引用门规原文',
        scores: { presence: 10, order: 9 }
      },
      {
        key: 'E',
        text: '你认了罚，回去把这条路重新走一遍：这条命硬得很，再来',
        scores: { presence: 5, order: 9 },
        seedTag: 'wukong'
      },
      {
        key: 'F',
        text: '你当场滑跪认罪，态度好到长老都不好意思重罚',
        scores: { presence: 1, order: 2 }
      }
    ],
    designNote:
      '会审压迫感拉满。B 植入哪吒气质（反骨、不认命），E 植入悟空气质（命硬、再来），都自然混在选项里。'
  },
  {
    id: 8,
    type: 'normal',
    pair: ['cognition', 'emotion'],
    scene: '修仙宗门',
    stem: '你最信任的小师弟，把你私改功法的事捅给了戒律堂，换来一个内门名额。',
    options: [
      {
        key: 'A',
        text: '你笑了：早留了一手，他交上去的那版功法是错的',
        scores: { cognition: 10, emotion: 2 }
      },
      {
        key: 'B',
        text: '你找他只问了一句：「红薯还烤吗」，他当场哭了',
        scores: { cognition: 5, emotion: 9 }
      },
      {
        key: 'C',
        text: '你拉黑删除一气呵成，修仙路上从此独行',
        scores: { cognition: 1, emotion: 2 }
      },
      {
        key: 'D',
        text: '你没追究，逢人还夸他：「那孩子，有前途」',
        scores: { cognition: 1, emotion: 9 }
      },
      {
        key: 'E',
        text: '你立刻盘算：他这枚棋子，以后还能怎么用',
        scores: { cognition: 5, emotion: 2 }
      },
      {
        key: 'F',
        text: '你算到他会走这一步，但没算到自己心这么疼',
        scores: { cognition: 10, emotion: 9 }
      }
    ],
    designNote:
      '背叛题，回收修仙-03 的红薯。A/F 纠结：「算无遗策的冷」vs「算到了还是疼」，B 是情感反杀。'
  },
  {
    id: 9,
    type: 'normal',
    pair: ['order', 'endurance'],
    scene: '修仙宗门',
    stem: '你收到判罚：废去半年修为，贬去后山守灵田。全宗都在传「那个天才废了」。',
    options: [
      {
        key: 'A',
        text: '你连夜收拾行李准备跑路，山下的世界也很大',
        scores: { order: 1, endurance: 2 }
      },
      {
        key: 'B',
        text: '你把判罚文书贴在床头，每天对着它多练两个时辰',
        scores: { order: 10, endurance: 9 }
      },
      {
        key: 'C',
        text: '你认了命，守灵田也挺清闲，顺便种点灵植卖钱',
        scores: { order: 5, endurance: 2 }
      },
      {
        key: 'D',
        text: '你去灵田第一天就开始搭棚子：既来之，则卷之',
        scores: { order: 1, endurance: 9 }
      },
      {
        key: 'E',
        text: '你要求戒律堂出具正式判罚文书，程序正义一步不能少',
        scores: { order: 10, endurance: 2 }
      },
      {
        key: 'F',
        text: '你嘴上认罚，每天半夜偷偷溜进藏经阁补课',
        scores: { order: 5, endurance: 9 }
      }
    ],
    designNote: '谷底题。B/D 纠结：「对着耻辱练」vs「换个赛道卷」，都是高韧性，一个赌气一个务实。'
  },
  {
    id: 10,
    type: 'normal',
    pair: ['presence', 'emotion'],
    scene: '修仙宗门',
    stem: '你守山守到第三个月，道侣发来传讯玉简：「我等你，但宗门安排的联姻对象是第一真传。」',
    options: [
      {
        key: 'A',
        text: '你回了三个字「信我，等我」，然后开始玩命修炼',
        scores: { presence: 10, emotion: 9 }
      },
      {
        key: 'B',
        text: '你回了句「你看着办」，感情的事你一向随缘',
        scores: { presence: 5, emotion: 2 }
      },
      {
        key: 'C',
        text: '你捏碎玉简：「下一个更乖」，继续锄你的灵田',
        scores: { presence: 1, emotion: 2 }
      },
      {
        key: 'D',
        text: '你没多话，每天一封传讯，雷打不动',
        scores: { presence: 5, emotion: 9 }
      },
      {
        key: 'E',
        text: '你直接杀到真传面前：「三个月后大比，我赢，婚事作废」',
        scores: { presence: 10, emotion: 2 }
      },
      {
        key: 'F',
        text: '你什么都没回，只是把她的名字刻在了田埂的界碑上',
        scores: { presence: 1, emotion: 9 }
      }
    ],
    designNote: '情感爆发点。E/F 纠结：「当众抢亲的莽」vs「刻碑不说的闷」，两种深情两种表达。'
  },
  {
    id: 11,
    type: 'easter',
    pair: ['presence', 'endurance'],
    scene: '修仙宗门',
    stem: '你熬满半年之期，修为只剩三成。站在灵田边看着自己的手，你想明白了一件事。',
    options: [
      {
        key: 'A',
        text: '「我不需要重回巅峰，我只需要比昨天强一点」',
        scores: { presence: 5, endurance: 9 }
      },
      {
        key: 'B',
        text: '「这条命硬得很。从头再来就从头再来，再来」',
        scores: { presence: 1, endurance: 9 },
        seedTag: 'wukong'
      },
      {
        key: 'C',
        text: '「算了，守一辈子灵田，也未必不是一种圆满」',
        scores: { presence: 1, endurance: 2 }
      },
      {
        key: 'D',
        text: '「三成修为怎么了，够我把基础功法再练一万遍」',
        scores: { presence: 10, endurance: 9 }
      },
      {
        key: 'E',
        text: '「三成修为也是命。命在，天就管不了我」',
        scores: { presence: 10, endurance: 2 },
        seedTag: 'nezha'
      },
      {
        key: 'F',
        text: '「先定个小目标，把明天的日出看完再说」',
        scores: { presence: 5, endurance: 2 }
      }
    ],
    designNote:
      '谷底觉醒题。B 植入悟空气质（命硬、再来），E 植入哪吒气质（天管不了我），混在四个「想通了」的正常选项里。'
  },
  {
    id: 12,
    type: 'normal',
    pair: ['presence', 'cognition'],
    scene: '修仙宗门',
    stem: '你站上宗门大比决赛场，对上当年那个内门天才。全场鸦雀无声，长老都在看。',
    options: [
      {
        key: 'A',
        text: '你弃权了：复仇最好的方式，是让他这辈子都够不着你',
        scores: { presence: 1, cognition: 2 }
      },
      {
        key: 'B',
        text: '你每一步都在复刻他当年赢你的路数，当众处刑',
        scores: { presence: 10, cognition: 9 }
      },
      {
        key: 'C',
        text: '你戴上斗篷参赛，打完就走，从此江湖只有传说',
        scores: { presence: 1, cognition: 9 }
      },
      {
        key: 'D',
        text: '你中规中矩打赢了，鞠个躬下台，深藏功与名',
        scores: { presence: 5, cognition: 2 }
      },
      {
        key: 'E',
        text: '你一剑破了他的成名绝技，赢得毫无技巧，全是感情',
        scores: { presence: 10, cognition: 2 }
      },
      {
        key: 'F',
        text: '你故意打满三百回合，让所有人看清他到底几斤几两',
        scores: { presence: 5, cognition: 9 }
      }
    ],
    designNote: '复仇高潮。B/E 纠结：「用你赢我的方式赢你」vs「一剑碾压」，一个诛心一个爽快。'
  },
  {
    id: 13,
    type: 'normal',
    pair: ['cognition', 'emotion'],
    scene: '修仙宗门',
    stem: '你大比夺魁之后，当年克扣你的执事和捅刀的小师弟一起来求你，在新长老面前美言几句。',
    options: [
      {
        key: 'A',
        text: '你心里早没了恨，但规矩要讲：功过分开算',
        scores: { cognition: 10, emotion: 9 }
      },
      {
        key: 'B',
        text: '你回了四个字：「哪位？不熟。」',
        scores: { cognition: 1, emotion: 2 }
      },
      {
        key: 'C',
        text: '你让他们互相推荐，自己搬个凳子看戏',
        scores: { cognition: 5, emotion: 2 }
      },
      {
        key: 'D',
        text: '你还是替小师弟说了情：「当年的红薯是真的」',
        scores: { cognition: 1, emotion: 9 }
      },
      {
        key: 'E',
        text: '你请他们吃了顿饭把话说开，但名额推荐了别人',
        scores: { cognition: 5, emotion: 9 }
      },
      {
        key: 'F',
        text: '你笑着答应，转身把他们当年的烂事整理成了年鉴',
        scores: { cognition: 10, emotion: 2 }
      }
    ],
    designNote:
      '清算题，红薯梗二次回收。A/D 纠结：「功过分开的清醒」vs「红薯是真的的念旧」，都是高姿态。'
  },
  {
    id: 14,
    type: 'normal',
    pair: ['emotion', 'order'],
    scene: '修仙宗门',
    stem: '你被掌门叫去传衣钵，条件是娶长老的女儿，并立誓永不追究当年冤案的真相。',
    options: [
      {
        key: 'A',
        text: '你先应下来再说，以后的事以后慢慢盘',
        scores: { emotion: 5, order: 2 }
      },
      {
        key: 'B',
        text: '你当众烧了条件书：「真相不换前途，这掌门我不当」',
        scores: { emotion: 1, order: 9 }
      },
      {
        key: 'C',
        text: '你提出等价交换：真相可以不追，但涉案人必须依规处置',
        scores: { emotion: 5, order: 9 }
      },
      {
        key: 'D',
        text: '你问的第一句话是：「那姑娘愿意吗」',
        scores: { emotion: 10, order: 2 }
      },
      {
        key: 'E',
        text: '你谢绝了：「衣钵挺好，但我的剧本我自己写」',
        scores: { emotion: 1, order: 2 }
      },
      {
        key: 'F',
        text: '你全都要：衣钵要接，真相要查，婚事先问问当事人',
        scores: { emotion: 10, order: 9 }
      }
    ],
    designNote:
      '终极交易题。B/F 纠结：「掀桌不当」vs「全都要」，D 把焦点拉回当事人，情感维度的最高级写法。'
  },
  {
    id: 15,
    type: 'normal',
    pair: ['order', 'endurance'],
    scene: '修仙宗门',
    stem: '你在飞升之夜扛完九道雷劫，还剩最后一道。你浑身焦黑地站着，全宗屏息仰望。',
    options: [
      {
        key: 'A',
        text: '你张开双臂迎上去：「九道都扛了，不差这一道」',
        scores: { order: 1, endurance: 9 }
      },
      {
        key: 'B',
        text: '你指着天喊：「按流程来，最后一道不许加量」',
        scores: { order: 10, endurance: 2 }
      },
      {
        key: 'C',
        text: '你回头看了一眼山下的灵田，然后迎了上去',
        scores: { order: 5, endurance: 9 }
      },
      {
        key: 'D',
        text: '你心想劈完这道就收工，飞升也就是换个地方上班',
        scores: { order: 5, endurance: 2 }
      },
      {
        key: 'E',
        text: '你盘膝坐下：「我按规矩应劫，你按规矩放我飞升」',
        scores: { order: 10, endurance: 9 }
      },
      {
        key: 'F',
        text: '你往旁边一闪：雷爱劈谁劈谁，你打算卡 bug 留在人间',
        scores: { order: 1, endurance: 2 }
      }
    ],
    designNote:
      '结局升华。A/C 是「扛过去」，E 是「和天讲规矩」，F 卡 bug 收尾扣住全篇的沙雕基调，让用户笑着答完。'
  }
]
