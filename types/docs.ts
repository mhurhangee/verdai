export interface DocMeta {
    slug: string[]
    title: string
    description?: string
    order?: number
    author?: string
    readingTime?: string
    level?: string
    tags?: string[]
    lastEdited?: string
}

export interface Doc extends DocMeta {
    content: string
}