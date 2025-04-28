import fs from 'fs'
import matter from 'gray-matter'
import path from 'path'
import { Doc, DocMeta } from '@/types/docs'

// Define the docs directory
const docsDirectory = path.join(process.cwd(), 'docs')

/**
 * Get all doc slugs (file paths relative to docs directory)
 * This function should only be called on the server
 */
export function getAllDocSlugs(): string[][] {
  const slugs: string[][] = []

  function traverseDirectory(currentPath: string[] = [], currentSlug: string[] = []) {
    try {
      const items = fs.readdirSync(path.join(docsDirectory, ...currentPath))

      for (const item of items) {
        const itemPath = [...currentPath, item]
        const fullPath = path.join(docsDirectory, ...itemPath)
        const stat = fs.statSync(fullPath)

        if (stat.isDirectory()) {
          traverseDirectory(itemPath, [...currentSlug, item])
        } else if (item.endsWith('.mdx')) {
          const slug = [...currentSlug, item.replace(/\.mdx$/, '')]
          slugs.push(slug)
        }
      }
    } catch (error) {
      console.error(`Error traversing directory ${currentPath}:`, error)
    }
  }

  traverseDirectory([], [])
  return slugs
}

/**
 * Get doc metadata for a specific slug
 * This function should only be called on the server
 */
export function getDocBySlug(slug: string[]): Doc {
  const realSlug = slug.join('/')
  const filePath = path.join(docsDirectory, `${realSlug}.mdx`)

  try {
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContents)
    const stat = fs.statSync(filePath)
    const lastEdited = stat.mtime.toISOString()

    // Calculate reading time if not present
    const words = content.split(/\s+/).length
    const minutes = Math.max(1, Math.round(words / 200))
    const readingTime = data.readingTime || `${minutes} min`

    return {
      slug,
      content,
      title: data.title || slug[slug.length - 1],
      description: data.description,
      order: data.order,
      author: data.author,
      readingTime,
      level: data.level,
      tags: data.tags,
      lastEdited,
    }
  } catch (error) {
    throw new Error(`Failed to load doc at ${realSlug}: ${error}`)
  }
}

/**
 * Get all docs metadata
 * This function should only be called on the server
 */
export function getAllDocs(): DocMeta[] {
  const slugs = getAllDocSlugs()
  const docs = slugs.map(slug => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { content: _unused, ...meta } = getDocBySlug(slug)
      return meta
    } catch (error) {
      console.error(`Error getting doc for slug ${slug.join('/')}:`, error)
      return {
        slug,
        title: slug[slug.length - 1],
      }
    }
  })

  // Sort by order if available, then by title
  return docs.sort((a, b) => {
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order
    }
    if (a.order !== undefined) return -1
    if (b.order !== undefined) return 1
    return a.title.localeCompare(b.title)
  })
}

/**
 * Get docs structure for navigation
 * This function should only be called on the server
 */
export function getDocsNavigation() {
  const allDocs = getAllDocs()
  const navigation: Record<string, DocMeta[]> = {}

  allDocs.forEach(doc => {
    const category = doc.slug.length > 1 ? doc.slug[0] : 'root'

    if (!navigation[category]) {
      navigation[category] = []
    }

    navigation[category].push(doc)
  })

  // Sort each category
  Object.keys(navigation).forEach(category => {
    navigation[category].sort((a, b) => {
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order
      }
      if (a.order !== undefined) return -1
      if (b.order !== undefined) return 1
      return a.title.localeCompare(b.title)
    })
  })

  return navigation
}
