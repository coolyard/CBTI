import { existsSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { characters } from '../index'
import { characterHeadFileName, characterPortraitFileName } from '../../utils/character-asset'

describe('立绘资产清单', () => {
  it('54 个角色立绘存在且单张 ≤200KB', () => {
    const validCharacters = characters.filter((character) => character.archetypeId !== 29)
    expect(validCharacters).toHaveLength(54)

    for (const character of validCharacters) {
      const fileName = characterPortraitFileName(character.id)
      const filePath = resolve(process.cwd(), 'src/pkg-characters/characters', fileName)
      expect(existsSync(filePath), `${character.id} 缺少 ${fileName}`).toBe(true)
      expect(
        statSync(filePath).size,
        `${character.id} 的 ${fileName} 超 200KB`
      ).toBeLessThanOrEqual(200 * 1024)
    }
  })

  it('54 个角色头部立绘存在且单张 ≤60KB、总量 ≤800KB', () => {
    const validCharacters = characters.filter((character) => character.archetypeId !== 29)
    expect(validCharacters).toHaveLength(54)

    let totalBytes = 0
    for (const character of validCharacters) {
      const fileName = characterHeadFileName(character.id)
      const filePath = resolve(process.cwd(), 'src/pkg-heads/heads', fileName)
      expect(existsSync(filePath), `${character.id} 缺少 ${fileName}`).toBe(true)
      const size = statSync(filePath).size
      totalBytes += size
      expect(size, `${character.id} 的 ${fileName} 超 60KB`).toBeLessThanOrEqual(60 * 1024)
    }
    expect(totalBytes, '头部立绘总量超 800KB').toBeLessThanOrEqual(800 * 1024)
  })
})
