import { DocsDataView } from '@/components/docs-dataview'
import { HubLayout } from '@/components/hub-layout'
import { getAllDocs, getDocsNavigation } from '@/lib/mdx'
import { BookIcon } from 'lucide-react'
import { DocsNav } from '@/components/docs-nav'
// Server Component
export default async function DocsPage() {
  // Get docs on the server
  const docs = getAllDocs()
  const navigation = getDocsNavigation()
  
  // Add IDs to docs for DataDisplay component
  const docsWithIds = docs.map(doc => ({
    ...doc,
    id: doc.slug.join('/')
  }))

  return (
    <HubLayout
      title="Documentation"
      icon={<BookIcon size={24} />}
      description="Welcome to Verda documentation. Find guides, resources, and reference materials to help you use Verda effectively."
      breadcrumbs={[{ label: 'Documentation', href: '/hub/docs' }]}
      fullWidth
    >
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        {/* Sidebar navigation on large screens, sheet on mobile handled by DocsNavigation */}
        <div className="lg:w-64 lg:flex-shrink-0 mb-6 lg:mb-0 sticky">
          <DocsNav navigation={navigation} />
        </div>
        <div className="flex-1 min-w-0">
          <DocsDataView docs={docsWithIds} />
        </div>
      </div>
    </HubLayout>
  )
}