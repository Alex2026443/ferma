import { spawn } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { build as bundleServer } from 'esbuild'

const root = process.cwd()
const stage = fs.mkdtempSync(path.join(os.tmpdir(), 'utrish-farm-build-'))
const stagedDist = path.join(stage, 'dist')
const stagedBoot = path.join(stage, 'boot.js')

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd: root, env: process.env, stdio: 'inherit' })
    child.once('error', reject)
    child.once('exit', (code, signal) => {
      if (code === 0) resolve()
      else reject(new Error(`Build command failed (${code ?? signal}): ${args.join(' ')}`))
    })
  })
}

try {
  await run(process.execPath, [
    path.join(root, 'node_modules/vite/bin/vite.js'),
    'build',
    '--outDir', stagedDist,
    '--emptyOutDir',
  ])
  await bundleServer({
    absWorkingDir: root,
    entryPoints: ['api/boot.ts'],
    platform: 'node',
    bundle: true,
    format: 'esm',
    outfile: stagedBoot,
    banner: { js: "import { createRequire } from 'module';const require = createRequire(import.meta.url);" },
  })
  await run(process.execPath, [path.join(root, 'scripts/sync-dist.mjs'), stagedDist, stagedBoot])
} finally {
  fs.rmSync(stage, { recursive: true, force: true })
}
