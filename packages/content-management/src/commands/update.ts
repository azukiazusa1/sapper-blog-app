import { createBlogPost, updateBlogPost, deleteBlogPost } from '../api.ts'
import { loadBlogPost } from '../fileOperation.ts'
import { basename } from 'path'

const { ADDED_FILES, MODIFIED_FILES, DELETED_FILES } = process.env

console.log('Added files:', ADDED_FILES)
console.log('Modified files:', MODIFIED_FILES)
console.log('Deleted files:', DELETED_FILES)

const getFilename = (path: string) => basename(path, '.md')

if (ADDED_FILES) {
  const addedFiles = ADDED_FILES.split(' ')
  let hasError = false
  for (const file of addedFiles) {
    const filename = getFilename(file)
    const result = await loadBlogPost(filename)
    if (!result.success) {
      hasError = true
      console.error(result.error)
      continue
    }
    await createBlogPost(result.data)
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
      console.error(result.error)
      continue
    }
    await updateBlogPost(result.data)
  }
  if (hasError) {
    process.exit(1)
  }
}

if (DELETED_FILES) {
  const deletedFiles = DELETED_FILES.split(' ')
  for (const file of deletedFiles) {
    const filename = getFilename(file)
    await deleteBlogPost(filename)
  }
}
