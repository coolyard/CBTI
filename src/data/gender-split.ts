import type { GenderSplitQuestion } from '../types'

export const genderSplitQuestion: GenderSplitQuestion = {
  id: 0,
  type: 'gender-split',
  scene: '灵魂戏楼',
  stem: '你随手点开一个链接，屏幕白光一闪。再睁眼时，你站在一座老戏楼的后台，面前挂着两套戏服——左边是玄色长衫，腰间佩玉；右边是织锦罗裙，袖中藏香。班主在帘后敲了敲烟杆："选一套，戏开场了，没有返场。"',
  options: [
    {
      key: 'A',
      text: '你取下玄色长衫披上，玉佩入手冰凉。帘幕拉开，台下有人举杯："这位公子，请入局。"',
      targetPool: 'male'
    },
    {
      key: 'B',
      text: '你取下织锦罗裙换上，袖中暗香浮动。帘幕拉开，台下有人举杯："这位姑娘，请入局。"',
      targetPool: 'female'
    }
  ]
}
