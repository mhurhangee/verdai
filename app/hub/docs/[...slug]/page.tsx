import { DocsMeta } from '@/components/docs-metadata'
import { mdxComponents } from '@/components/docs-mdx-components'
import { getAllDocSlugs, getDocBySlug, getDocsNavigation } from '@/lib/mdx'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { notFound } from 'next/navigation'
import { HubLayout } from '@/components/hub-layout'
import { DocsNav } from '@/components/docs-nav'
import { format } from 'date-fns'

export async function generateStaticParams() {
  const slugs = getAllDocSlugs()
  return slugs.map(slug => ({ slug }))
}

export default async function DocPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params

  try {
    const doc = getDocBySlug(slug)
    const navigation = getDocsNavigation()
    // Format dates server-side
    const formattedLastEdited = doc.lastEdited ?
      format(new Date(doc.lastEdited), 'd MMM') : undefined;

    return (
      <HubLayout
        title={undefined}
        icon={undefined}
        description={undefined}
        breadcrumbs={[
          { label: 'Documentation', href: '/hub/docs' },
          ...(doc.title ? [{ label: doc.title }] : [])
        ]}
        fullWidth
      >
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          {/* Sidebar navigation on large screens, sheet on mobile handled by DocsNav */}
          <div className="lg:w-64 lg:flex-shrink-0 mb-6 lg:mb-0 sticky top-10">
            <DocsNav navigation={navigation} />
          </div>
          <div className="flex-1 min-w-0">
            <article className="max-w-full overflow-hidden pr-2">
              <header className="mb-8">
                {doc.title && <h1 className="mb-1 text-4xl font-bold tracking-tight">{doc.title}</h1>}
                <DocsMeta
                  author={doc.author}
                  readingTime={doc.readingTime}
                  level={doc.level}
                  tags={doc.tags}
                  lastEdited={formattedLastEdited}
                  className="mt-1 mb-2"
                />
                {doc.description && (
                  <p className="text-muted-foreground mt-2 text-lg">{doc.description}</p>
                )}
              </header>
              <div className="prose dark:prose-invert max-w-none">
                <MDXRemote source={doc.content} components={mdxComponents} />
              </div>
              <div className="mt-8 border-t pt-8">
                <p className="text-muted-foreground text-sm">
                  Found an issue with this page? Please contact support or{' '}
                  <a href="#" className="text-primary hover:underline">
                    suggest improvements
                  </a>
                  .
                </p>
              </div>
            </article>
          </div>
        </div>
      </HubLayout>
    )
  } catch {
    notFound()
  }
}
