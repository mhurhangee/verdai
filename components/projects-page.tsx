'use client'

import { ProjectCreateDialog } from '@/components/project-create-dialog'
import { ProjectActions } from '@/components/projects-action-buttons'
import { DataDisplay, SortOption } from '@/components/datadisplay'
import { DataItem } from '@/components/dataitem'
import { DataItemSkeleton } from '@/components/dataitem-skeleton'
import { filterAndSortProjects } from '@/lib/project-actions'
import { fetcher } from '@/lib/fetcher'
import { useDataView } from '@/hooks/use-dataview'
import { ClockIcon, FileIcon, FolderIcon } from 'lucide-react'
import { format } from 'date-fns'
import { useMemo } from 'react'
import useSWR from 'swr'

// Define sort options for projects
const PROJECT_SORT_OPTIONS: SortOption[] = [
  { value: 'name', label: 'Name' },
  { value: 'created', label: 'Date created' },
  { value: 'edited', label: 'Last updated' },
]

type ProjectSortKey = 'name' | 'created' | 'edited'

export function ProjectsPageContent() {
  const { data, mutate, isLoading } = useSWR('/api/projects', fetcher)
  
  // Use the data display hook for managing state
  const { 
    viewMode,
    searchTerm,
    sortBy,
    sortDirection,
    setViewMode,
    setSearchTerm,
    setSortBy,
    setSortDirection,
    persistKey 
  } = useDataView<ProjectSortKey>({
    section: 'projects',
    defaultSortField: 'created',
    defaultSortDirection: 'desc',
  })

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    const projects = Array.isArray(data?.projects) ? data.projects : []
    return filterAndSortProjects(
      projects, 
      searchTerm, 
      (sortBy ?? 'created'), 
      sortDirection
    )
  }, [data?.projects, searchTerm, sortBy, sortDirection])

  if (isLoading) {
    return <DataItemSkeleton count={5} />
  }

  return (
    <div className="w-full">
      <DataDisplay
        items={filteredProjects}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        persistKey={persistKey}
        emptyMessage="No projects found. Create a new project to get started."
        
        // Search features
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search projects..."
        
        // Sort features
        sortOptions={PROJECT_SORT_OPTIONS}
        sortBy={sortBy}
        onSortChange={(value) => setSortBy(value as ProjectSortKey)}
        sortDirection={sortDirection}
        onSortDirectionChange={setSortDirection}
        
        // Render each project
        renderItem={(project, currentViewMode) => {
          const fileCount = data?.projectFileCounts?.[project.id] ?? 0
          
          return (
            <DataItem
              key={project.id}
              viewMode={currentViewMode}
              title={project.projectName}
              description={project.description || undefined}
              icon={
                project.emoji ? (
                  <span className="text-xl">{project.emoji}</span>
                ) : (
                  <span className="text-xl">🍀</span>
                )
              }
              metadata={
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="flex items-center gap-1">
                    <ClockIcon className="h-3.5 w-3.5" />
                    {format(new Date(project.updatedAt), 'dd MMM')}
                  </span>
                  <span className="flex items-center gap-1">
                    <FileIcon className="h-3.5 w-3.5" />
                    {fileCount} files
                  </span>
                  <span className="flex items-center gap-1">
                    <FolderIcon className="h-3.5 w-3.5" />
                    {project.category || 'No category'}
                  </span>
                </div>
              }
              linkTo={`/hub/projects/${project.id}`}
              actions={<ProjectActions project={project} onChanged={mutate} />}
            />
          )
        }}
      />
    </div>
  )
}

// Provide the primary action component for the page
export function ProjectsPageAction({ onCreated }: { onCreated?: () => void }) {
  return <ProjectCreateDialog onCreated={onCreated} />
}