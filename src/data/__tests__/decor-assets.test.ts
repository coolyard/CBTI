import { existsSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { DECOR_NAMES } from '../../utils/decor'

describe('背景装饰贴纸资产清单', () => {
  it('16 张贴纸存在且单张 ≤60KB、总量 ≤300KB', () => {
    expect(DECOR_NAMES).toHaveLength(16)
    let totalSize = 0

    for (const name of DECOR_NAMES) {
      const filePath = resolve(process.cwd(), 'src/static/decor', `decor-${name}.webp`)
      expect(existsSync(filePath), `缺少 decor-${name}.webp`).toBe(true)
      const size = statSync(filePath).size
      expect(size, `decor-${name}.webp 超 60KB`).toBeLessThanOrEqual(60 * 1024)
      totalSize += size
    }

    expect(totalSize).toBeLessThanOrEqual(300 * 1024)
  })
})
