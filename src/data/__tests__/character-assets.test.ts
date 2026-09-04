import { existsSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { characters } from '../index'
import { characterPortraitFileName } from '../../utils/character-asset'

describe('立绘资产清单', () => {
  it('56 张 MP JPG 主包立绘存在且总量在主包预算内', () => {
    expect(characters).toHaveLength(56)
    let totalBytes = 0
    for (const character of characters) {
      const fileName = characterPortraitFileName(character.id, 'jpg')
      const filePath = resolve(process.cwd(), 'src/static/characters', fileName)
      expect(existsSync(filePath), `${character.id} 缺少 ${fileName}`).toBe(true)
      totalBytes += statSync(filePath).size
    }
    expect(totalBytes).toBeLessThanOrEqual(2 * 1024 * 1024)
  })

  it('56 张 640 母版保留给 H5 使用', () => {
    for (const character of characters) {
      const fileName = characterPortraitFileName(character.id, 'webp')
      const filePath = resolve(process.cwd(), 'src/pkg-characters/characters', fileName)
      expect(existsSync(filePath), `${character.id} 缺少 ${fileName}`).toBe(true)
    }
  })
})
