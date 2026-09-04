/**
 * 都市闺蜜职场 题库（由 scripts/build-match-table.py 生成，禁止手改）
 */
import type { Question } from '../../types'

export const rawQuestions: Question[] = [
  {
    id: 1,
    type: 'normal',
    pair: ['presence', 'endurance'],
    scene: '都市闺蜜职场',
    stem: '你入职第一天，HR 让你在工位图上选座位，剩下的只有打印机旁边和厕所对面。',
    options: [
      {
        key: 'A',
        text: '你心想先苟过试用期，摸清了再换',
        scores: { presence: 5, endurance: 9 }
      },
      {
        key: 'B',
        text: '你直接走到窗边空位：「这个位置我看上了，谁有意见」',
        scores: { presence: 10, endurance: 2 }
      },
      {
        key: 'C',
        text: '你一边坐下一边记下了全部门的派系分布',
        scores: { presence: 1, endurance: 9 }
      },
      {
        key: 'D',
        text: '你中规中矩选了打印机旁，安慰自己方便',
        scores: { presence: 5, endurance: 2 }
      },
      {
        key: 'E',
        text: '你默默去了厕所对面，心想工位而已',
        scores: { presence: 1, endurance: 2 }
      },
      {
        key: 'F',
        text: '你笑着跟人换到好位置，还顺手帮全组订了咖啡',
        scores: { presence: 10, endurance: 9 }
      }
    ],
    designNote: '入职第一关。B/F 纠结：「直接抢窗位」vs「换座兼买咖啡」，E 认怂但理直气壮。'
  },
  {
    id: 2,
    type: 'normal',
    pair: ['cognition', 'order'],
    scene: '都市闺蜜职场',
    stem: '你发现组里的杂活全压在新人头上，老员工准点下班，你的转正答辩材料还没人带你写。',
    options: [
      {
        key: 'A',
        text: '你认了，杂活也是活',
        scores: { cognition: 1, order: 2 }
      },
      {
        key: 'B',
        text: '你按流程向 HR 反馈，哪怕没用也要留个记录',
        scores: { cognition: 5, order: 9 }
      },
      {
        key: 'C',
        text: '你转身研究起考核制度漏洞，准备玩把大的',
        scores: { cognition: 10, order: 2 }
      },
      {
        key: 'D',
        text: '你找老同事请教规矩，把这次记成「学费」',
        scores: { cognition: 1, order: 9 }
      },
      {
        key: 'E',
        text: '你忍了，但默默记下每口锅是从谁手里飞来的',
        scores: { cognition: 5, order: 2 }
      },
      {
        key: 'F',
        text: '你连夜翻遍员工手册，把分工违规记录整理成册',
        scores: { cognition: 10, order: 9 }
      }
    ],
    designNote: '立足第一课。C/F 纠结：「钻漏洞玩大的」vs「用手册砸回去」，都是高认知但路子相反。'
  },
  {
    id: 3,
    type: 'normal',
    pair: ['emotion', 'endurance'],
    scene: '都市闺蜜职场',
    stem: '你入职一周，全组没人带你，只有隔壁组的夏夏拉你拼单奶茶：「第二杯半价，我看你顺眼。」',
    options: [
      {
        key: 'A',
        text: '你没说什么，但此后每天给她带早饭',
        scores: { emotion: 5, endurance: 9 }
      },
      {
        key: 'B',
        text: '你心想：无事献殷勤，她图我拼单',
        scores: { emotion: 1, endurance: 2 }
      },
      {
        key: 'C',
        text: '你把这杯奶茶记在心里，决定连她的份一起卷',
        scores: { emotion: 10, endurance: 9 }
      },
      {
        key: 'D',
        text: '你面无表情接过，转头替她挡下了客户的连环 call',
        scores: { emotion: 1, endurance: 9 }
      },
      {
        key: 'E',
        text: '你接过奶茶说了声谢，心里暖了一下，也就一下',
        scores: { emotion: 5, endurance: 2 }
      },
      {
        key: 'F',
        text: '你眼眶一热碰了杯：「以后我的瓜分你一半」',
        scores: { emotion: 10, endurance: 2 }
      }
    ],
    designNote:
      '锚点角色「夏夏」登场（奶茶信物，为都市-08/10/13 埋伏笔）。F/C 是「当场破防」，D 是「嘴硬但扛事」。'
  },
  {
    id: 4,
    type: 'normal',
    pair: ['presence', 'cognition'],
    scene: '都市闺蜜职场',
    stem: '你在季度提案会被总监临时点名顶上主讲，台下坐着全公司高管，材料你只看过一遍。',
    options: [
      {
        key: 'A',
        text: '你照稿念完，实则记下每个高管皱眉的位置',
        scores: { presence: 1, cognition: 9 }
      },
      {
        key: 'B',
        text: '你中规中矩讲完，没翻车也没掌声',
        scores: { presence: 5, cognition: 2 }
      },
      {
        key: 'C',
        text: '你先抛个数据示弱，第三页掏出藏了三个月的方案',
        scores: { presence: 10, cognition: 9 }
      },
      {
        key: 'D',
        text: '你推荐了组里最会讲的同事，自己躲去翻页',
        scores: { presence: 1, cognition: 2 }
      },
      {
        key: 'E',
        text: '你主打一个能耗，把提问环节拖成你的主场',
        scores: { presence: 5, cognition: 9 }
      },
      {
        key: 'F',
        text: '你合上 PPT 直接脱稿：「我来讲讲这页纸背后的东西」',
        scores: { presence: 10, cognition: 2 }
      }
    ],
    designNote: '临阵亮相。C/F 纠结：「示弱藏方案」vs「脱稿炸场」，都是高光打法，算计程度不同。'
  },
  {
    id: 5,
    type: 'normal',
    pair: ['emotion', 'order'],
    scene: '都市闺蜜职场',
    stem: '你熬三个月的方案让公司中标了，庆功宴上，总监举杯：「这个项目，是我一手带的。」',
    options: [
      {
        key: 'A',
        text: '你私下找他：这次让您，下次署名权得谈清楚',
        scores: { emotion: 5, order: 9 }
      },
      {
        key: 'B',
        text: '你无所谓，功劳又不能换加班费，摸鱼才是正经事',
        scores: { emotion: 1, order: 2 }
      },
      {
        key: 'C',
        text: '你念着他带你入门没拆台，但从此心里有本账',
        scores: { emotion: 10, order: 2 }
      },
      {
        key: 'D',
        text: '你当众拿出项目日志要求更正署名，谁劝都没用',
        scores: { emotion: 1, order: 9 }
      },
      {
        key: 'E',
        text: '你笑笑没说话，反正你的目标是下一个更大的标',
        scores: { emotion: 5, order: 2 }
      },
      {
        key: 'F',
        text: '你当众给足他面子，回头把项目邮件链整理好存档',
        scores: { emotion: 10, order: 9 }
      }
    ],
    designNote: '承段冲突升级。C/D 是「情分」与「规矩」的极端对撞，F 是两者兼顾的高端局。'
  },
  {
    id: 6,
    type: 'normal',
    pair: ['cognition', 'endurance'],
    scene: '都市闺蜜职场',
    stem: '你在项目上线前夜遇到服务器崩溃，客户群里炸锅，技术全下班了，只有你守在工位。',
    options: [
      {
        key: 'A',
        text: '你在群里发了个抱头表情包：「在修了在修了」',
        scores: { cognition: 1, endurance: 2 }
      },
      {
        key: 'B',
        text: '你边排查边安抚客户，凌晨四点修好还出了复盘',
        scores: { cognition: 10, endurance: 9 }
      },
      {
        key: 'C',
        text: '你看不懂代码，但扛骂你在行，顶着客户护住团队',
        scores: { cognition: 5, endurance: 9 }
      },
      {
        key: 'D',
        text: '你啥也不会，只能一遍遍重启，试到天亮也不停',
        scores: { cognition: 1, endurance: 9 }
      },
      {
        key: 'E',
        text: '你照着运维手册一步步来，苟到技术员上线',
        scores: { cognition: 5, endurance: 2 }
      },
      {
        key: 'F',
        text: '你三分钟内定位到配置错误，重启回滚，手都在抖',
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
    scene: '都市闺蜜职场',
    stem: '你在述职大会上被总监甩锅：「这个决策是她做的。」全会议室的目光钉在你身上。',
    options: [
      {
        key: 'A',
        text: '你打个太极混过去，转头该怎么干还怎么干',
        scores: { presence: 5, order: 2 }
      },
      {
        key: 'B',
        text: '你直接甩出会议纪要：「字是你签的，念给大家听听」',
        scores: { presence: 10, order: 2 }
      },
      {
        key: 'C',
        text: '你低声认下流程失误，却把三百天打卡记录投上大屏：「一天都不少」',
        scores: { presence: 1, order: 9 },
        seedTag: 'jingwei'
      },
      {
        key: 'D',
        text: '你站起来环视全场：「锅我可以背，人我来保，天塌下来我顶着」',
        scores: { presence: 10, order: 9 },
        seedTag: 'nuwa'
      },
      {
        key: 'E',
        text: '你认了罚，回来把邮件记录导出备份了三份',
        scores: { presence: 5, order: 9 }
      },
      {
        key: 'F',
        text: '你当场鞠躬道歉，态度好到总监都不好意思再骂',
        scores: { presence: 1, order: 2 }
      }
    ],
    designNote:
      '甩锅压迫感拉满。C 植入精卫气质（打卡记录一天不少），D 植入女娲气质（天塌我顶、护住团队）。'
  },
  {
    id: 8,
    type: 'normal',
    pair: ['cognition', 'emotion'],
    scene: '都市闺蜜职场',
    stem: '你发现把方案底价透给竞标对手的是夏夏——她带着你的方案跳去了对手公司，升了总监。',
    options: [
      {
        key: 'A',
        text: '你见了她只问一句：「奶茶还拼吗」，她当场哭了',
        scores: { cognition: 5, emotion: 9 }
      },
      {
        key: 'B',
        text: '你没追究，逢人还说：「她啊，有能力」',
        scores: { cognition: 1, emotion: 9 }
      },
      {
        key: 'C',
        text: '你笑了：早留了一手，她带走的那份报价表是假的',
        scores: { cognition: 10, emotion: 2 }
      },
      {
        key: 'D',
        text: '你拉黑删除一气呵成，职场上从此独行',
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
      '背叛题，回收都市-03 的奶茶。C/E 纠结：「留一手的冷」vs「算到了还是疼」，A 是情感反杀。'
  },
  {
    id: 9,
    type: 'normal',
    pair: ['order', 'endurance'],
    scene: '都市闺蜜职场',
    stem: '你被移出核心项目组，进了优化名单。全公司都在传「她要被裁了」。',
    options: [
      {
        key: 'A',
        text: '你连夜更新简历准备跑路，外面的世界也很大',
        scores: { order: 1, endurance: 2 }
      },
      {
        key: 'B',
        text: '你嘴上认命，每天下班后偷偷打磨自己的方案',
        scores: { order: 5, endurance: 9 }
      },
      {
        key: 'C',
        text: '你要求 HR 出具正式调岗文件，流程正义一步不能少',
        scores: { order: 10, endurance: 2 }
      },
      {
        key: 'D',
        text: '你到新岗位第一天就开始卷：既来之，则安之',
        scores: { order: 1, endurance: 9 }
      },
      {
        key: 'E',
        text: '你认了，边缘岗位也清闲，顺便搞搞副业',
        scores: { order: 5, endurance: 2 }
      },
      {
        key: 'F',
        text: '你把优化名单截图设成屏保，每天对着它多干两小时',
        scores: { order: 10, endurance: 9 }
      }
    ],
    designNote: '谷底题。F/D 纠结：「对着耻辱卷」vs「换个赛道卷」，都是高韧性，一个赌气一个务实。'
  },
  {
    id: 10,
    type: 'normal',
    pair: ['presence', 'emotion'],
    scene: '都市闺蜜职场',
    stem: '你在裁员名单公示前夜被夏夏约去撸串，她哭着说：对手公司掏空方案后把她架空了。',
    options: [
      {
        key: 'A',
        text: '你没多话，每天一条行业资讯发她，雷打不动',
        scores: { presence: 5, emotion: 9 }
      },
      {
        key: 'B',
        text: '你回了三个字「等着我」，然后打开电脑写方案到天亮',
        scores: { presence: 10, emotion: 2 }
      },
      {
        key: 'C',
        text: '你什么都没说，只是默默把单买了，跟她拼了第二杯半价',
        scores: { presence: 1, emotion: 9 }
      },
      {
        key: 'D',
        text: '你回了句「哦」，感情的事你一向随缘',
        scores: { presence: 5, emotion: 2 }
      },
      {
        key: 'E',
        text: '你冷笑一声：「下一个更乖」，继续涮你的毛肚',
        scores: { presence: 1, emotion: 2 }
      },
      {
        key: 'F',
        text: '你把串签一放：「哭完没，哭完跟我杀回去」',
        scores: { presence: 10, emotion: 9 }
      }
    ],
    designNote: '情感爆发点。B/C 纠结：「写方案到天亮的燃」vs「买单不说的闷」，两种深情两种表达。'
  },
  {
    id: 11,
    type: 'easter',
    pair: ['presence', 'endurance'],
    scene: '都市闺蜜职场',
    stem: '你在公示前一晚独自在办公室改方案。看着屏幕上自己的倒影，你想明白了一件事。',
    options: [
      {
        key: 'A',
        text: '「我不需要一步登天，我只需要比昨天多改一版」',
        scores: { presence: 5, endurance: 9 }
      },
      {
        key: 'B',
        text: '「天塌了？我来补。先补这个烂尾的项目」',
        scores: { presence: 10, endurance: 9 },
        seedTag: 'nuwa'
      },
      {
        key: 'C',
        text: '「算了，被裁拿 N+1，也未必不是一种圆满」',
        scores: { presence: 1, endurance: 2 }
      },
      {
        key: 'D',
        text: '「这口气，我一天咽不下，就改一万版」',
        scores: { presence: 1, endurance: 9 },
        seedTag: 'jingwei'
      },
      {
        key: 'E',
        text: '「名单算什么。明天我就让全公司重新认识我」',
        scores: { presence: 10, endurance: 2 }
      },
      {
        key: 'F',
        text: '「先定个小目标，把今晚的外卖吃完再说」',
        scores: { presence: 5, endurance: 2 }
      }
    ],
    designNote:
      '谷底觉醒题。D 植入精卫气质（改一万版），B 植入女娲气质（补天梗化用），混在四个「想通了」里。'
  },
  {
    id: 12,
    type: 'normal',
    pair: ['presence', 'cognition'],
    scene: '都市闺蜜职场',
    stem: '你在年度竞标和夏夏的公司狭路相逢。作为新项目负责人走上台，全场直播。',
    options: [
      {
        key: 'A',
        text: '你让同事代讲，中标就走，从此行业只有传说',
        scores: { presence: 1, cognition: 9 }
      },
      {
        key: 'B',
        text: '你中规中矩讲完方案，中标了也只是点头致意',
        scores: { presence: 5, cognition: 2 }
      },
      {
        key: 'C',
        text: '你用她当年赢你的路数赢下竞标，当众处刑',
        scores: { presence: 10, cognition: 9 }
      },
      {
        key: 'D',
        text: '你退出竞标：复仇最好的方式，是让她这辈子够不着你',
        scores: { presence: 1, cognition: 2 }
      },
      {
        key: 'E',
        text: '你故意把答辩拖满全场，让所有人看清两份方案的真假',
        scores: { presence: 5, cognition: 9 }
      },
      {
        key: 'F',
        text: '你一句「这个底价是谁透的，我有证据」，全场炸了',
        scores: { presence: 10, cognition: 2 }
      }
    ],
    designNote: '复仇高潮。C/F 纠结：「用你的路数赢你」vs「当众掀证据」，一个诛心一个爽快。'
  },
  {
    id: 13,
    type: 'normal',
    pair: ['cognition', 'emotion'],
    scene: '都市闺蜜职场',
    stem: '你升总监之后，当年甩锅的老总监和被架空的夏夏一起来求你，在新项目里给个机会。',
    options: [
      {
        key: 'A',
        text: '你笑着答应，转身把他们当年的操作整理成了避坑指南',
        scores: { cognition: 10, emotion: 2 }
      },
      {
        key: 'B',
        text: '你请他们喝了杯咖啡把话说开，但名额推荐了别人',
        scores: { cognition: 5, emotion: 9 }
      },
      {
        key: 'C',
        text: '你还是给夏夏递了橄榄枝：「当年的奶茶是真的」',
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
      '清算题，奶茶二次回收。D/C 纠结：「功过分开的清醒」vs「奶茶是真的的念旧」，都是高姿态。'
  },
  {
    id: 14,
    type: 'normal',
    pair: ['emotion', 'order'],
    scene: '都市闺蜜职场',
    stem: '你收到投资人的意向书：投大钱，条件是签竞业协议，并对当年的竞标黑幕永久保密。',
    options: [
      {
        key: 'A',
        text: '你先应下来再说，以后的事以后慢慢盘',
        scores: { emotion: 5, order: 2 }
      },
      {
        key: 'B',
        text: '你当众撕了协议：「真相不换投资，这字我不签」',
        scores: { emotion: 1, order: 9 }
      },
      {
        key: 'C',
        text: '你问的第一句话是：「我的团队能一起带吗」',
        scores: { emotion: 10, order: 2 }
      },
      {
        key: 'D',
        text: '你提出等价交换：黑幕可以不提，当事人必须公开道歉',
        scores: { emotion: 5, order: 9 }
      },
      {
        key: 'E',
        text: '你谢绝了：「投资挺好，但我的剧本我自己写」',
        scores: { emotion: 1, order: 2 }
      },
      {
        key: 'F',
        text: '你全都要：投资要拿，真相要说，协议得重新谈',
        scores: { emotion: 10, order: 9 }
      }
    ],
    designNote:
      '终极交易题。B/F 纠结：「撕了不签」vs「全都要」，C 把焦点拉回团队，情感维度的最高级写法。'
  },
  {
    id: 15,
    type: 'normal',
    pair: ['order', 'endurance'],
    scene: '都市闺蜜职场',
    stem: '你的公司敲钟那天，你在台上看着台下为你鼓掌的所有人，手里握着发言稿。',
    options: [
      {
        key: 'A',
        text: '你回头看了一眼台下的夏夏，然后笑了',
        scores: { order: 5, endurance: 9 }
      },
      {
        key: 'B',
        text: '你举起锤子：「十年都熬了，不差这一下」',
        scores: { order: 1, endurance: 9 }
      },
      {
        key: 'C',
        text: '你盯着流程单逐项核对：敲钟环节，一步不能乱',
        scores: { order: 10, endurance: 2 }
      },
      {
        key: 'D',
        text: '你心想敲完这钟就收工，上市也就是换个地方上班',
        scores: { order: 5, endurance: 2 }
      },
      {
        key: 'E',
        text: '你把稿子一塞：钟爱谁敲谁敲，你要卡 bug 回去补觉',
        scores: { order: 1, endurance: 2 }
      },
      {
        key: 'F',
        text: '你把致辞里的每个名字都念到，一个都不少',
        scores: { order: 10, endurance: 9 }
      }
    ],
    designNote: '结局升华。F/C 是「规矩人」的极致，B 是「扛过去」，E 塞稿子收尾扣住全篇的沙雕基调。'
  }
]
