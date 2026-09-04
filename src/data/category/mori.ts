/**
 * 末日求生 题库（由 scripts/build-match-table.py 生成，禁止手改）
 */
import type { Question } from '../../types'

export const rawQuestions: Question[] = [
  {
    id: 1,
    type: 'normal',
    pair: ['presence', 'endurance'],
    scene: '末日求生',
    stem: '你在灾变第一天跟着人流冲进避难所，门口守卫举着登记表喊：「报技能，没技能的去下层。」',
    options: [
      {
        key: 'A',
        text: '你心想先苟进内区，摸清规矩再露头',
        scores: { presence: 5, endurance: 9 }
      },
      {
        key: 'B',
        text: '你挤到最前面：「会急救会格斗，给我一支队伍」',
        scores: { presence: 10, endurance: 2 }
      },
      {
        key: 'C',
        text: '你默默观察每个人的腰牌，把布防图记在了心里',
        scores: { presence: 1, endurance: 9 }
      },
      {
        key: 'D',
        text: '你老老实实登记：「会做饭」，领了件灰马甲',
        scores: { presence: 5, endurance: 2 }
      },
      {
        key: 'E',
        text: '你被挤到队尾，心想下层的铺位也是铺位',
        scores: { presence: 1, endurance: 2 }
      },
      {
        key: 'F',
        text: '你高声报了技能，还顺手把混乱的人群排成了队',
        scores: { presence: 10, endurance: 9 }
      }
    ],
    designNote: '入所第一关。B/F 纠结：「抢队炸场」vs「技能组织双全」，E 认怂但理直气壮。'
  },
  {
    id: 2,
    type: 'normal',
    pair: ['cognition', 'order'],
    scene: '末日求生',
    stem: '你发现避难所按人头配给，你领到的罐头只有一半，配给员翻白眼：「新来的就这个价。」',
    options: [
      {
        key: 'A',
        text: '你转身盯上配给处的库存漏洞，准备玩把大的',
        scores: { cognition: 10, order: 2 }
      },
      {
        key: 'B',
        text: '你揣着半罐罐头走了，心想总比没有强',
        scores: { cognition: 1, order: 2 }
      },
      {
        key: 'C',
        text: '你找到管委会按流程投诉，哪怕没用也要留个记录',
        scores: { cognition: 5, order: 9 }
      },
      {
        key: 'D',
        text: '你连夜翻遍配给条例，把他的克扣记录整理成册',
        scores: { cognition: 10, order: 9 }
      },
      {
        key: 'E',
        text: '你蹲在门口观察了一整天，把每条规矩问了个遍',
        scores: { cognition: 1, order: 9 }
      },
      {
        key: 'F',
        text: '你忍了，但默默记下配给员的换岗时间',
        scores: { cognition: 5, order: 2 }
      }
    ],
    designNote: '立足第一课。A/D 纠结：「钻漏洞玩大的」vs「用规则砸回去」，都是高认知但路子相反。'
  },
  {
    id: 3,
    type: 'normal',
    pair: ['emotion', 'endurance'],
    scene: '末日求生',
    stem: '你发现全避难所没人理你，只有邻铺的阿棠掰了半罐黄桃罐头给你：「姐，你眼神不像等死的人。」',
    options: [
      {
        key: 'A',
        text: '你没说什么，但此后每次外出都给她带样东西',
        scores: { emotion: 5, endurance: 9 }
      },
      {
        key: 'B',
        text: '你心想：末日里的黄桃罐头，怕是没那么简单',
        scores: { emotion: 1, endurance: 2 }
      },
      {
        key: 'C',
        text: '你把这句话记在心里，决定连她的份一起活下去',
        scores: { emotion: 10, endurance: 9 }
      },
      {
        key: 'D',
        text: '你面无表情接过，转头替她赶走了抢铺位的醉汉',
        scores: { emotion: 1, endurance: 9 }
      },
      {
        key: 'E',
        text: '你接过罐头说了声谢，心里暖了一下，也就一下',
        scores: { emotion: 5, endurance: 2 }
      },
      {
        key: 'F',
        text: '你鼻子一酸：「从今天起，你的事就是我的事」',
        scores: { emotion: 10, endurance: 2 }
      }
    ],
    designNote:
      '锚点角色「阿棠」登场（罐头信物，为末日-08/10/13 埋伏笔）。F/C 是「当场破防」，D 是「嘴硬但扛事」。'
  },
  {
    id: 4,
    type: 'normal',
    pair: ['presence', 'cognition'],
    scene: '末日求生',
    stem: '你报名搜寻队第一次外出，目标是三条街外的药店，感染者比情报多了十倍。',
    options: [
      {
        key: 'A',
        text: '你蹲在最后面殿后，实则记下了整条街的地形',
        scores: { presence: 1, cognition: 9 }
      },
      {
        key: 'B',
        text: '你中规中矩跟队搜完，没立功也没掉队',
        scores: { presence: 5, cognition: 2 }
      },
      {
        key: 'C',
        text: '你先在对面楼顶放火引开尸群，再从容搬空药店',
        scores: { presence: 10, cognition: 9 }
      },
      {
        key: 'D',
        text: '你研究了赌约赔率，含泪押了隔壁小队先回来',
        scores: { presence: 1, cognition: 2 }
      },
      {
        key: 'E',
        text: '你主打一个能耗，把尸群溜到腿软再回头拿药',
        scores: { presence: 5, cognition: 9 }
      },
      {
        key: 'F',
        text: '你抄起撬棍正面硬刚，杀出一条路，帅是帅，差点没回来',
        scores: { presence: 10, cognition: 2 }
      }
    ],
    designNote: '首次外出。C/F 纠结：「调虎离山」vs「正面硬刚」，都是高光打法，算计程度不同。'
  },
  {
    id: 5,
    type: 'normal',
    pair: ['emotion', 'order'],
    scene: '末日求生',
    stem: '你带队带回整箱抗生素，论功行赏时，队长把功劳全算在自己头上，还升了职。',
    options: [
      {
        key: 'A',
        text: '你私下找她：这次让你，下次补给得三七分',
        scores: { emotion: 5, order: 9 }
      },
      {
        key: 'B',
        text: '你无所谓，功劳又不能换罐头，活着才是正经事',
        scores: { emotion: 1, order: 2 }
      },
      {
        key: 'C',
        text: '你念着她救过你一次没撕破脸，但从此心里有本账',
        scores: { emotion: 10, order: 2 }
      },
      {
        key: 'D',
        text: '你当众按所规第三条要求重新核验功劳，谁劝都没用',
        scores: { emotion: 1, order: 9 }
      },
      {
        key: 'E',
        text: '你笑笑没说话，反正你的目标是下一次更重要的行动',
        scores: { emotion: 5, order: 2 }
      },
      {
        key: 'F',
        text: '你当众给足她面子，回头把搜寻日志交给了管委会',
        scores: { emotion: 10, order: 9 }
      }
    ],
    designNote: '承段冲突升级。C/D 是「情分」与「规矩」的极端对撞，F 是两者兼顾的高端局。'
  },
  {
    id: 6,
    type: 'normal',
    pair: ['cognition', 'endurance'],
    scene: '末日求生',
    stem: '你随小队深入医院找疫苗，冷库没找到，反而惊动了整层楼的感染者。',
    options: [
      {
        key: 'A',
        text: '你当场蹲下抱头：「别管我，你们先走，记得给我立碑」',
        scores: { cognition: 1, endurance: 2 }
      },
      {
        key: 'B',
        text: '你边找出口边断后，最后一个出来，还顺了两支疫苗',
        scores: { cognition: 10, endurance: 9 }
      },
      {
        key: 'C',
        text: '你看不懂尸潮规律，但扛门你在行，顶着铁门护住全队',
        scores: { cognition: 5, endurance: 9 }
      },
      {
        key: 'D',
        text: '你啥也不会，只能咬着牙一步步挪，指甲抠断也不停',
        scores: { cognition: 1, endurance: 9 }
      },
      {
        key: 'E',
        text: '你跟着队里最稳的人走，苟到走廊恢复安静',
        scores: { cognition: 5, endurance: 2 }
      },
      {
        key: 'F',
        text: '你三息之内找到通风管，带队丝血逃出，出来腿都是软的',
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
    scene: '末日求生',
    stem: '你被指控「私藏药品、破坏配给制」，避难所大会审，管委会要你当场认罪交赃。',
    options: [
      {
        key: 'A',
        text: '你打了个哈哈混过去，转头该怎么藏还怎么藏',
        scores: { presence: 5, order: 2 }
      },
      {
        key: 'B',
        text: '你声音比主任还大：「我救人的时候你们在哪」',
        scores: { presence: 10, order: 2 }
      },
      {
        key: 'C',
        text: '你低声认了罚，只求一件事：「每日巡查记录，一页不能少」',
        scores: { presence: 1, order: 9 },
        seedTag: 'jingwei'
      },
      {
        key: 'D',
        text: '你一拍桌子站起来：「药是我藏的，人是我救的，天塌下来我顶着」',
        scores: { presence: 10, order: 9 },
        seedTag: 'nuwa'
      },
      {
        key: 'E',
        text: '你认了罚，回来把配给条例抄了三遍找漏洞',
        scores: { presence: 5, order: 9 }
      },
      {
        key: 'F',
        text: '你当场痛哭认错，态度好到委员都不好意思重罚',
        scores: { presence: 1, order: 2 }
      }
    ],
    designNote:
      '会审压迫感拉满。C 植入精卫气质（认死理、日复一日），D 植入女娲气质（天塌我顶、罩着所有人）。'
  },
  {
    id: 8,
    type: 'normal',
    pair: ['cognition', 'emotion'],
    scene: '末日求生',
    stem: '你发现捅出你私藏药品的是阿棠——她用你的秘密换了两张去安全区的船票。',
    options: [
      {
        key: 'A',
        text: '你见了她只问一句：「罐头还甜吗」，她当场哭了',
        scores: { cognition: 5, emotion: 9 }
      },
      {
        key: 'B',
        text: '你没追究，逢人还说：「那姑娘，不容易」',
        scores: { cognition: 1, emotion: 9 }
      },
      {
        key: 'C',
        text: '你笑了：早留了一手，她交出去的药箱里装的是淀粉片',
        scores: { cognition: 10, emotion: 2 }
      },
      {
        key: 'D',
        text: '你拉黑删除一气呵成，末日里从此独行',
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
      '背叛题，回收末日-03 的罐头。C/E 纠结：「留一手的冷」vs「算到了还是疼」，A 是情感反杀。'
  },
  {
    id: 9,
    type: 'normal',
    pair: ['order', 'endurance'],
    scene: '末日求生',
    stem: '你被判逐出避难所，独自面对外面的黑夜。全所都在传「那个女人完了」。',
    options: [
      {
        key: 'A',
        text: '你连夜收拾准备远走，南方的世界也很大',
        scores: { order: 1, endurance: 2 }
      },
      {
        key: 'B',
        text: '你嘴上认罚，每天半夜继续给老弱送药',
        scores: { order: 5, endurance: 9 }
      },
      {
        key: 'C',
        text: '你要求管委会出具正式判决文书，程序一步不能少',
        scores: { order: 10, endurance: 2 }
      },
      {
        key: 'D',
        text: '你在所外废墟安营第一天就开始砌墙：既来之，则安之',
        scores: { order: 1, endurance: 9 }
      },
      {
        key: 'E',
        text: '你认了，野外也清闲，顺便种点土豆',
        scores: { order: 5, endurance: 2 }
      },
      {
        key: 'F',
        text: '你把判决文书贴在帐篷上，每天对着它多练一小时',
        scores: { order: 10, endurance: 9 }
      }
    ],
    designNote: '谷底题。F/D 纠结：「对着耻辱练」vs「换种活法卷」，都是高韧性，一个赌气一个务实。'
  },
  {
    id: 10,
    type: 'normal',
    pair: ['presence', 'emotion'],
    scene: '末日求生',
    stem: '你在流放第三个月截获一条无线电：安全区的船根本没开，阿棠被骗，困在码头等死。',
    options: [
      {
        key: 'A',
        text: '你没多话，每天固定频率呼她一次，雷打不动',
        scores: { presence: 5, emotion: 9 }
      },
      {
        key: 'B',
        text: '你回了三个字「信我，等我」，然后连夜出发',
        scores: { presence: 10, emotion: 2 }
      },
      {
        key: 'C',
        text: '你什么都没回，只是把她的名字刻在了营地的界石上',
        scores: { presence: 1, emotion: 9 }
      },
      {
        key: 'D',
        text: '你回了句「她自找的」，感情的事你一向随缘',
        scores: { presence: 5, emotion: 2 }
      },
      {
        key: 'E',
        text: '你捏碎耳机：「下一个更乖」，继续种你的土豆',
        scores: { presence: 1, emotion: 2 }
      },
      {
        key: 'F',
        text: '你带上所有补给杀向码头：「她的命，我来捞」',
        scores: { presence: 10, emotion: 9 }
      }
    ],
    designNote: '情感爆发点。B/C 纠结：「连夜出发的莽」vs「刻名不说的闷」，两种深情两种表达。'
  },
  {
    id: 11,
    type: 'easter',
    pair: ['presence', 'endurance'],
    scene: '末日求生',
    stem: '你赶到码头救下阿棠和一群被骗的人。看着海面上那艘沉船，你想明白了一件事。',
    options: [
      {
        key: 'A',
        text: '「我不需要拯救世界，我只需要比昨天多救一个人」',
        scores: { presence: 5, endurance: 9 }
      },
      {
        key: 'B',
        text: '「天塌了？那就顶着。先救人，再补天」',
        scores: { presence: 10, endurance: 9 },
        seedTag: 'nuwa'
      },
      {
        key: 'C',
        text: '「算了，码头风大，回去种土豆也未必不是圆满」',
        scores: { presence: 1, endurance: 2 }
      },
      {
        key: 'D',
        text: '「这海，我一天填不平，就填一万天。先把人安顿好」',
        scores: { presence: 1, endurance: 9 },
        seedTag: 'jingwei'
      },
      {
        key: 'E',
        text: '「规矩靠边，今晚我就掀了这管委会」',
        scores: { presence: 10, endurance: 2 }
      },
      {
        key: 'F',
        text: '「先定个小目标，把今晚熬过去再说」',
        scores: { presence: 5, endurance: 2 }
      }
    ],
    designNote:
      '谷底觉醒题。D 植入精卫气质（填海梗化用），B 植入女娲气质（补天梗化用），混在四个「想通了」里。'
  },
  {
    id: 12,
    type: 'normal',
    pair: ['presence', 'cognition'],
    scene: '末日求生',
    stem: '你在尸潮攻破大门那晚，带着救下的人杀回来，直面当年判你的管委会。',
    options: [
      {
        key: 'A',
        text: '你故意让他们先撑到极限再出手，让所有人看清斤两',
        scores: { presence: 5, cognition: 9 }
      },
      {
        key: 'B',
        text: '你绕开正门走了：复仇最好的方式，是让他们够不着你',
        scores: { presence: 1, cognition: 2 }
      },
      {
        key: 'C',
        text: '你一枪打爆探照灯接管指挥：「现在，听我的」',
        scores: { presence: 10, cognition: 2 }
      },
      {
        key: 'D',
        text: '你蒙面参战，打完就走，从此避难所只有传说',
        scores: { presence: 1, cognition: 9 }
      },
      {
        key: 'E',
        text: '你用他们当年定的条例逐条夺回指挥权，当众处刑',
        scores: { presence: 10, cognition: 9 }
      },
      {
        key: 'F',
        text: '你中规中矩打完防卫战，天亮就交还指挥权',
        scores: { presence: 5, cognition: 2 }
      }
    ],
    designNote: '复仇高潮。E/C 纠结：「用你们的条例夺权」vs「一枪接管」，一个诛心一个爽快。'
  },
  {
    id: 13,
    type: 'normal',
    pair: ['cognition', 'emotion'],
    scene: '末日求生',
    stem: '你在避难所重建后收到求助：当年判你的委员和骗阿棠的黄牛，一起来求你美言几句。',
    options: [
      {
        key: 'A',
        text: '你笑着答应，转身把他们当年的烂账编成了《灾变年鉴》',
        scores: { cognition: 10, emotion: 2 }
      },
      {
        key: 'B',
        text: '你请他们喝了顿粥把话说开，但名额推荐了别人',
        scores: { cognition: 5, emotion: 9 }
      },
      {
        key: 'C',
        text: '你还是替阿棠投了票：「当年的罐头是真的」',
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
      '清算题，罐头二次回收。D/C 纠结：「功过分开的清醒」vs「罐头是真的的念旧」，都是高姿态。'
  },
  {
    id: 14,
    type: 'normal',
    pair: ['emotion', 'order'],
    scene: '末日求生',
    stem: '你被新议会提名当所长，条件是接纳大批财阀入所，并永不公开「疫苗早被私藏」的真相。',
    options: [
      {
        key: 'A',
        text: '你先应下来再说，以后的事以后慢慢盘',
        scores: { emotion: 5, order: 2 }
      },
      {
        key: 'B',
        text: '你当众烧了条件书：「真相不换前途，这所长我不当」',
        scores: { emotion: 1, order: 9 }
      },
      {
        key: 'C',
        text: '你问的第一句话是：「下层的孩子们同意吗」',
        scores: { emotion: 10, order: 2 }
      },
      {
        key: 'D',
        text: '你提出等价交换：真相可以不追，疫苗必须公开配给',
        scores: { emotion: 5, order: 9 }
      },
      {
        key: 'E',
        text: '你谢绝了：「所长挺好，但我的剧本我自己写」',
        scores: { emotion: 1, order: 2 }
      },
      {
        key: 'F',
        text: '你全都要：所长要当，真相要查，财阀得按规矩审',
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
    scene: '末日求生',
    stem: '你在新家园的围墙上迎来了灾变后的第一个春天，墙外最后一批尸群正在逼近。',
    options: [
      {
        key: 'A',
        text: '你回头看了一眼墙内的万家灯火，然后迎了上去',
        scores: { order: 5, endurance: 9 }
      },
      {
        key: 'B',
        text: '你提着撬棍迎上去：「一个冬天都熬了，不差这一波」',
        scores: { order: 1, endurance: 9 }
      },
      {
        key: 'C',
        text: '你指着警报器喊：「按预案来，最后一波不许加戏」',
        scores: { order: 10, endurance: 2 }
      },
      {
        key: 'D',
        text: '你心想打完这波就收工，守家园也就是换个地方上班',
        scores: { order: 5, endurance: 2 }
      },
      {
        key: 'E',
        text: '你往地道里一钻：怪爱打谁打谁，你打算卡 bug 苟到剧终',
        scores: { order: 1, endurance: 2 }
      },
      {
        key: 'F',
        text: '你把防御条例执行到最后一行，墙内桃花照常开',
        scores: { order: 10, endurance: 9 }
      }
    ],
    designNote: '结局升华。F/C 是「规矩人」的极致，B 是「扛过去」，E 钻地道收尾扣住全篇的沙雕基调。'
  }
]
