import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const stagedDist = process.argv[2] ? path.resolve(process.argv[2]) : null
const stagedBoot = process.argv[3] ? path.resolve(process.argv[3]) : null
if (!stagedDist || !stagedBoot) throw new Error('Usage: node scripts/sync-dist.mjs <staged-dist> <staged-boot>')

const dist = path.resolve('dist')
const mirror = path.join(dist, 'public')
const publicDir = path.resolve('public')
const pause = (ms = 250) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms)

function retry(operation, attempts = 60) {
  let lastError
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      return operation()
    } catch (error) {
      lastError = error
      pause()
    }
  }
  throw lastError
}

function listTree(base) {
  const files = []
  const walk = directory => {
    for (const entry of retry(() => fs.readdirSync(directory, { withFileTypes: true }))) {
      const absolute = path.join(directory, entry.name)
      if (entry.isDirectory()) walk(absolute)
      else if (entry.isFile()) files.push(absolute)
    }
  }
  walk(base)
  return files.sort()
}

function hashFile(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
}

function copyVerified(source, destination, expectedHash = hashFile(source)) {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      if (hashFile(destination) === expectedHash) return
    } catch {
      // Create or repair the destination below.
    }
    try {
      fs.mkdirSync(path.dirname(destination), { recursive: true })
      fs.copyFileSync(source, destination)
      if (hashFile(destination) === expectedHash) return
    } catch {
      // The output mount occasionally exposes files late; retry the synchronous copy.
    }
    pause()
  }
  throw new Error(`Unable to synchronize ${destination}`)
}

for (const required of ['index.html', 'manifest.webmanifest', 'registerSW.js', 'sw.js']) {
  if (!fs.statSync(path.join(stagedDist, required)).isFile()) throw new Error(`Missing staged file: ${required}`)
}
const generatedFiles = listTree(stagedDist)
if (!generatedFiles.some(file => path.basename(file).startsWith('workbox-'))) {
  throw new Error('Missing staged Workbox runtime')
}
if (!fs.statSync(stagedBoot).isFile()) throw new Error('Missing staged server bundle')
const publicFiles = listTree(publicDir)
if (publicFiles.length === 0) throw new Error('Public asset manifest is empty')

retry(() => fs.rmSync(dist, { recursive: true, force: true }))
retry(() => fs.mkdirSync(mirror, { recursive: true }))

const copies = []
for (const source of generatedFiles) {
  const relative = path.relative(stagedDist, source)
  copies.push({ source, destination: path.join(dist, relative) })
  copies.push({ source, destination: path.join(mirror, relative) })
}
for (const source of publicFiles) {
  const relative = path.relative(publicDir, source)
  copies.push({ source, destination: path.join(dist, relative) })
  copies.push({ source, destination: path.join(mirror, relative) })
}
copies.push({ source: stagedBoot, destination: path.join(dist, 'boot.js') })

let lastProblems = []
for (let pass = 0; pass < 10; pass += 1) {
  const problems = []
  for (const copy of copies) {
    try {
      copyVerified(copy.source, copy.destination)
    } catch {
      problems.push(copy.destination)
    }
  }
  if (problems.length === 0) {
    pause(500)
    for (const copy of copies) {
      try {
        if (hashFile(copy.destination) !== hashFile(copy.source)) problems.push(copy.destination)
      } catch {
        problems.push(copy.destination)
      }
    }
  }
  if (problems.length === 0) {
    console.log(JSON.stringify({
      generatedFiles: generatedFiles.length,
      publicFiles: publicFiles.length,
      mirroredFiles: generatedFiles.length + publicFiles.length,
      serverBundle: 'dist/boot.js',
      status: 'sha256-verified',
    }))
    process.exit(0)
  }
  lastProblems = problems
  pause(500)
}

throw new Error(`Distribution verification failed: ${[...new Set(lastProblems)].join(', ')}`)
