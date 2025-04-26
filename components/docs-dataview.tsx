'use client'

import { DataDisplay } from '@/components/datadisplay'
import { DataItem } from '@/components/dataitem'
import { useDataView } from '@/hooks/use-dataview'
import { Badge } from '@/components/ui/badge'
import { ReactNode, useMemo } from 'react'
import { format } from 'date-fns'
import { 
  BookIcon, 
  FileTextIcon, 
  FolderIcon, 
  NavigationIcon, 
  LightbulbIcon, 
  ClockIcon, 
  UserIcon, 
  TimerIcon, 
  TagIcon 
} from 'lucide-react'

interface DocItem {
  id: string
  title: string
  description?: string
  slug: string[]
  lastEdited?: string
  author?: string
  readingTime?: string
  level?: string
  tags?: string[]
}

interface DocsDataViewProps {
  docs: DocItem[]
  groupByCategory?: boolean
}

export function DocsDataView({
  docs,
  groupByCategory = true,
}: DocsDataViewProps) {
  // Use the data display hook for managing search, sort, and view mode
  const { 
    viewMode,
    searchTerm,
    setViewMode,
    setSearchTerm,
    persistKey 
  } = useDataView({
    section: 'docs',
    defaultViewMode: 'grid',
  })

  // Filter docs by search term
  const filteredDocs = useMemo(() => {
    if (!searchTerm) return docs
    
    const term = searchTerm.toLowerCase()
    return docs.filter(doc => 
      doc.title.toLowerCase().includes(term) || 
      (doc.description && doc.description.toLowerCase().includes(term)) ||
      (doc.tags && doc.tags.some(tag => tag.toLowerCase().includes(term)))
    )
  }, [docs, searchTerm])

  // Get icon for category
  const getCategoryIcon = (category: string): ReactNode => {
    switch (category) {
      case 'root':
        return <NavigationIcon className="text-primary h-5 w-5" />
      case 'projects':
        return <FolderIcon className="text-primary h-5 w-5" />
      case 'files':
        return <FileTextIcon className="text-primary h-5 w-5" />
      case 'features':
        return <LightbulbIcon className="text-primary h-5 w-5" />
      default:
        return <BookIcon className="text-primary h-5 w-5" />
    }
  }

  // Format category name for display
  const formatCategoryName = (category: string): string => {
    if (category === 'root') return 'Getting Started'
    return category.charAt(0).toUpperCase() + category.slice(1)
  }

  // Format date to a more readable format
  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'No date'
    return format(new Date(dateString), 'd MMM')
  }

  // Group function for grouping docs by category
  const groupByFunc = groupByCategory 
    ? (doc: DocItem) => doc.slug.length > 1 ? doc.slug[0] : 'root'
    : undefined

  // Group label renderer
  const groupLabelFunc = groupByCategory
    ? (category: string) => (
        <div className="flex items-center gap-3">
          {getCategoryIcon(category)}
          <h2 className="text-2xl font-semibold">{formatCategoryName(category)}</h2>
        </div>
      )
    : undefined

  return (
    <DataDisplay
      items={filteredDocs}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
      persistKey={persistKey}
      emptyMessage="No documentation found. Add .mdx files to the /docs directory to get started."
      
      // Search features
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      placeholder="Search documentation..."
      
      // Grouping
      groupBy={groupByFunc}
      groupLabel={groupLabelFunc}
      
      // Render each doc
      renderItem={(doc, currentViewMode) => {
        const category = doc.slug.length > 1 ? doc.slug[0] : 'root'
        
        // Generate metadata and badges from frontmatter
        const metadataElements = [];
        if (doc.lastEdited) {
          metadataElements.push(
            <span key="updated" className="flex items-center gap-1">
              <ClockIcon className="h-3.5 w-3.5" />
              {formatDate(doc.lastEdited)}
            </span>
          );
        }
        
        if (doc.author) {
          metadataElements.push(
            <span key="author" className="flex items-center gap-1">
              <UserIcon className="h-3.5 w-3.5" />
              {doc.author}
            </span>
          );
        }
        
        if (doc.readingTime) {
          metadataElements.push(
            <span key="reading" className="flex items-center gap-1">
              <TimerIcon className="h-3.5 w-3.5" />
              {doc.readingTime} read
            </span>
          );
        }
        
        // Create badges for tags and level
        const badges = [];
        if (doc.level) {
          badges.push(
            <Badge key="level" variant="outline" className="flex items-center gap-1">
              <TagIcon className="h-3 w-3" />
              {doc.level}
            </Badge>
          );
        }
        
        if (doc.tags && doc.tags.length > 0) {
          doc.tags.forEach((tag, i) => {
            badges.push(
              <Badge key={`tag-${i}`} variant="secondary">
                {tag}
              </Badge>
            );
          });
        }
        
        return (
          <DataItem
            key={doc.id}
            viewMode={currentViewMode}
            title={doc.title}
            description={doc.description}
            icon={getCategoryIcon(category)}
            linkTo={`/hub/docs/${doc.slug.join('/')}`}
            metadata={
              metadataElements.length > 0 ? (
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                  {metadataElements}
                </div>
              ) : undefined
            }
            badges={badges.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {badges}
              </div>
            ) : undefined}
          />
        )
      }}
    />
  )
}