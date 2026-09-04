import { characterPortraitPath } from './character-asset'

function readErrorText(event: unknown): string {
  const candidate = event as { detail?: { errMsg?: unknown }; message?: unknown } | null
  if (typeof candidate?.detail?.errMsg === 'string' && candidate.detail.errMsg) {
    return candidate.detail.errMsg
  }
  if (typeof candidate?.message === 'string' && candidate.message) {
    return candidate.message
  }
  return String(event ?? 'unknown')
}

export function reportImageError(label: string, event: unknown): void {
  const errMsg = readErrorText(event)
  console.error('[CBTI][img]', label, errMsg)
}

export function logImageEnvironment(): void {
  try {
    const info = uni.getWindowInfo()
    console.warn('[CBTI][img-env]', {
      platform: (info as { platform?: string }).platform ?? 'unknown',
      portraitSrc: characterPortraitPath('1-m')
    })
  } catch (error) {
    console.warn('[CBTI][img-env]', error)
  }
}
