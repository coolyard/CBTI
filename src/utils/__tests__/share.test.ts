import { describe, expect, it } from 'vitest'
import { buildShareTitle, createShareMessage } from '../share'

describe('分享文案', () => {
  it('buildShareTitle 生成结果页分享标题', () => {
    expect(buildShareTitle('高启强')).toBe('我的 CBTI 灵魂角色是「高启强」，你的脑子里住着谁？')
  })

  it('createShareMessage 路径回首页', () => {
    expect(createShareMessage('高启强')).toEqual({
      title: '我的 CBTI 灵魂角色是「高启强」，你的脑子里住着谁？',
      path: '/pages/home/index'
    })
  })
})
