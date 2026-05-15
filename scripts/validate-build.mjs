import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { bookings, scenarios } from '../src/prototypeData.js'
import { simulateScenario } from '../src/prototypeLogic.js'

const requiredFiles = ['index.html', 'src/main.jsx', 'src/styles.css', 'src/prototypeData.js', 'src/prototypeLogic.js']
await Promise.all(requiredFiles.map(file => readFile(file, 'utf8')))

const statuses = scenarios.map(s => simulateScenario(s.id, bookings[0]).status)
const expected = ['Success', 'Timeout', 'Empty result', 'Price changed', 'Hold expired']
if (JSON.stringify(statuses) !== JSON.stringify(expected)) {
  throw new Error(`Scenario coverage mismatch: ${statuses.join(', ')}`)
}

await rm('dist', { recursive: true, force: true })
await mkdir('dist/src', { recursive: true })
await Promise.all([
  cp('src', 'dist/src', { recursive: true }),
  cp('README.md', 'dist/README.md'),
])
const index = await readFile('index.html', 'utf8')
await writeFile('dist/index.html', index)

console.log(`Prototype build validation passed: ${requiredFiles.length} files, ${statuses.length} mock scenarios.`)
console.log('Deployable static artifact generated at dist/.')
