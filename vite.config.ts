import { defineConfig, type ViteDevServer } from 'vite'
import uniImport from '@dcloudio/vite-plugin-uni'
import UnoCSS from 'unocss/vite'
import { cpSync, createReadStream, existsSync, mkdirSync, statSync } from 'node:fs'
import { extname, resolve, sep } from 'node:path'

// 见 specs/10 §1：@dcloudio/* 版本必须同批升级
// 兼容说明：该插件以 CJS `exports.default` 导出，ESM 下默认导入得到的是模块对象，需取 .default
type UniPluginFactory = typeof uniImport
const uni: UniPluginFactory =
  typeof uniImport === 'function'
    ? uniImport
    : (uniImport as unknown as { default: UniPluginFactory }).default

const PKG_CONTENT_TYPES: Record<string, string> = {
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg'
}

function servePkgAssetsDev(packageRoot: string) {
  const prefix = `/${packageRoot}/`
  const sourceRoot = resolve(process.cwd(), 'src', packageRoot)
  return {
    name: `serve-${packageRoot}-dev`,
    apply: 'serve' as const,
    configureServer(server: ViteDevServer) {
      server.middlewares.use((req, res, next) => {
        const url = (req.url ?? '').split('?')[0]
        if (!url.startsWith(prefix)) {
          next()
          return
        }

        const relative = url.slice(prefix.length)
        const filePath = resolve(sourceRoot, relative)
        if (!filePath.startsWith(sourceRoot + sep)) {
          res.statusCode = 403
          res.end('Forbidden')
          return
        }

        if (!existsSync(filePath) || !statSync(filePath).isFile()) {
          next()
          return
        }

        const contentType = PKG_CONTENT_TYPES[extname(filePath).toLowerCase()]
        if (!contentType) {
          next()
          return
        }

        res.setHeader('Content-Type', contentType)
        createReadStream(filePath).pipe(res)
      })
    }
  }
}

const PKG_ASSET_GROUPS = [
  {
    source: resolve(process.cwd(), 'src/pkg-characters/characters'),
    relative: 'pkg-characters/characters'
  },
  {
    source: resolve(process.cwd(), 'src/pkg-heads/heads'),
    relative: 'pkg-heads/heads'
  }
]

function copyPkgAssets() {
  return {
    name: 'copy-pkg-assets',
    apply: 'build' as const,
    closeBundle() {
      const outputRoots = new Set(['dist/build/h5', 'dist/build/mp-weixin'])
      if (process.env.UNI_OUTPUT_DIR) {
        outputRoots.add(process.env.UNI_OUTPUT_DIR)
      }
      for (const group of PKG_ASSET_GROUPS) {
        for (const outputRoot of outputRoots) {
          const target = resolve(process.cwd(), outputRoot, group.relative)
          mkdirSync(target, { recursive: true })
          cpSync(group.source, target, { recursive: true })
        }
      }
    }
  }
}

export default defineConfig({
  plugins: [
    uni(),
    UnoCSS(),
    servePkgAssetsDev('pkg-characters'),
    servePkgAssetsDev('pkg-heads'),
    copyPkgAssets()
  ]
})
