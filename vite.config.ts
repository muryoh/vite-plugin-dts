import { resolve } from 'path'
import { existsSync, readdirSync, lstatSync, rmdirSync, unlinkSync } from 'fs'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { dtsPlugin } from './src/plugin'

const root = resolve('./example')
emptyDir(resolve(root, 'types'))

export default defineConfig({
  root,
  resolve: {
    // alias: [{ find: /^@\/(.+)/, replacement: resolve(__dirname, '$1') }]
    alias: {
      '@': resolve(root),
      '@components': resolve(root, 'src/components')
    }
  },
  build: {
    lib: {
      entry: resolve(root, 'src/index.ts'),
      name: 'Test',
      formats: ['es'],
      fileName: 'test'
    },
    rollupOptions: {
      external: ['vue']
    }
  },
  plugins: [
    dtsPlugin({
      outputDir: 'types',
      // include: ['src/index.ts'],
      exclude: ['src/ignore'],
      staticImport: true,
      // skipDiagnostics: false,
      // logDiagnostics: true,
      insertTypesEntry: true,
      rollupTypes: false
    }),
    vue()
  ]
})

function emptyDir(dir: string): void {
  if (!existsSync(dir)) {
    return
  }

  for (const file of readdirSync(dir)) {
    const abs = resolve(dir, file)

    // baseline is Node 12 so can't use rmSync
    if (lstatSync(abs).isDirectory()) {
      emptyDir(abs)
      rmdirSync(abs)
    } else {
      unlinkSync(abs)
    }
  }
}
