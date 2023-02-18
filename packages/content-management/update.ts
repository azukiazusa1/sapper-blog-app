import { createBlogPost, updateBlogPost, deleteBlogPost } from './src/api.js'
import { getBlogFile } from './src/fileOperation.js'
import { basename } from 'path'

const { ADDED_FILES, MODIFIED_FILES, DELETED_FILES } = process.env

const getFilename = (path: string) => basename(path, '.md')

if (ADDED_FILES) {
  const addedFiles = ADDED_FILES.split(' ')
  for (const file of addedFiles) {
    const filename = getFilename(file)
    const result = await getBlogFile(filename)
    console.log(result)
    // await createBlogPost(result)
  }
}

if (MODIFIED_FILES) {
  const modifiedFiles = MODIFIED_FILES.split(' ')
  for (const file of modifiedFiles) {
    const filename = getFilename(file)
    const result = await getBlogFile(filename)
    console.log(result)
    // await updateBlogPost(result)
  }
}

if (DELETED_FILES) {
  const deletedFiles = DELETED_FILES.split(' ')
  for (const file of deletedFiles) {
    const filename = getFilename(file)
    const result = await getBlogFile(filename)
    console.log(result)
    // await deleteBlogPost(result)
  }
}
