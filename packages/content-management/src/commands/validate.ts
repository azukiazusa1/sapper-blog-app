import { loadBlogPost } from '../fileOperation.js'
import { basename } from 'path'
import * as core from '@actions/core'
import { getOctokit } from '@actions/github'

const { ADDED_FILES, MODIFIED_FILES } = process.env

console.log('Added files:', ADDED_FILES)
console.log('Modified files:', MODIFIED_FILES)

const owner = core.getInput('owner', { required: true })
const repo = core.getInput('repo', { required: true })
const pr_number = core.getInput('pr_number', { required: true })
const token = core.getInput('token', { required: true })

const octokit = getOctokit(token)

const getFilename = (path: string) => basename(path, '.md')

if (ADDED_FILES) {
  const addedFiles = ADDED_FILES.split(' ')
  let hasError = false
  for (const file of addedFiles) {
    const filename = getFilename(file)
    const result = await loadBlogPost(filename)
    if (!result.success) {
      hasError = true
      octokit.rest.issues.createComment({
        owner,
        repo,
        issue_number: Number(pr_number),
        body: `${result.error}`,
      })
    }
  }
  if (hasError) {
    process.exit(1)
  }
}

if (MODIFIED_FILES) {
  const modifiedFiles = MODIFIED_FILES.split(' ')
  let hasError = false
  for (const file of modifiedFiles) {
    const filename = getFilename(file)
    const result = await loadBlogPost(filename)
    if (!result.success) {
      hasError = true
      octokit.rest.issues.createComment({
        owner,
        repo,
        issue_number: Number(pr_number),
        body: `${result.error}`,
      })
    }
  }
  if (hasError) {
    process.exit(1)
  }
}
