import { execSync } from 'node:child_process'

function git(command) {
  try {
    return execSync(`git ${command}`, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim()
  } catch {
    return ''
  }
}

const remote = git('remote get-url origin')
const match = remote.match(/github\.com[:/](?<owner>[^/]+)\/(?<repo>[^/.]+)(?:\.git)?$/)

if (!match?.groups) {
  console.error('No GitHub origin remote found. Add one first: git remote add origin git@github.com:<owner>/<repo>.git')
  process.exit(1)
}

const { owner, repo } = match.groups
console.log(`https://${owner}.github.io/${repo}/`)
