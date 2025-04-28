'use client'

import { useEffect, useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { ListToolbar } from '@/components/ui/list-toolbar'
import { ViewMode, ViewModeToggle } from '@/components/ui/view-mode-toggle'

import { HubLayout } from '@/components/hub-layout'
import { CreateProjectDialog } from '@/components/projects/create-project-dialog'
import { ProjectsList } from '@/components/projects/projects-list'

import { fetcher } from '@/lib/utils'
import { useHasMounted } from '@/lib/utils/use-has-mounted'

import type { Project } from '@/types/projects'

import { FolderClosed } from 'lucide-react'
import { toast } from 'sonner'
import useSWR, { mutate } from 'swr'
import { useLocalStorage } from 'usehooks-ts'

export default function ProjectsPage() {
  const { data, error, isLoading } = useSWR<{ projects: Project[] }>('/api/project', fetcher)
  const [viewMode, setViewMode] = useLocalStorage<ViewMode>('projects-view-mode', 'grid')
  const hasMounted = useHasMounted()

  // Toolbar state
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<'title' | 'updatedAt'>('updatedAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    if (error) toast.error('Failed to load projects')
  }, [error])

  // Filtering and sorting logic
  const filteredProjects = useMemo(() => {
    if (!data?.projects) return []
    let result = data.projects
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        p =>
          p.title.toLowerCase().includes(q) ||
          (p.description?.toLowerCase().includes(q) ?? false) ||
          p.tags?.some(tag => tag.toLowerCase().includes(q))
      )
    }
    result = [...result].sort((a, b) => {
      let cmp = 0
      if (sort === 'title') cmp = a.title.localeCompare(b.title)
      else if (sort === 'updatedAt')
        cmp = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
      return sortOrder === 'asc' ? cmp : -cmp
    })
    return result
  }, [data?.projects, search, sort, sortOrder])

  return (
    <HubLayout
      title={<span className="flex items-center gap-2">Projects</span>}
      description="A list of your AI project workspaces."
      icon={<FolderClosed />}
      breadcrumbs={[{ label: 'Projects' }]}
      actions={
        <div className="flex items-center gap-3">
          <CreateProjectDialog onCreated={() => mutate('/api/project')}>
            <Button className="cursor-pointer">Create Project</Button>
          </CreateProjectDialog>
        </div>
      }
    >
      <div className="mb-4 flex flex-col items-center justify-between gap-2 sm:flex-row">
        <ListToolbar
          search={search}
          onSearch={setSearch}
          sort={sort}
          sortOrder={sortOrder}
          onSort={v => setSort(v as 'title' | 'updatedAt')}
          onToggleSortOrder={() => setSortOrder(o => (o === 'asc' ? 'desc' : 'asc'))}
          sortOptions={[
            { value: 'updatedAt', label: 'Last Updated' },
            { value: 'title', label: 'Title' },
          ]}
        >
          {hasMounted && <ViewModeToggle value={viewMode} onChange={setViewMode} />}
        </ListToolbar>
      </div>
      <ProjectsList
        projects={filteredProjects}
        isLoading={isLoading}
        viewMode={hasMounted ? viewMode : 'grid'}
      />
    </HubLayout>
  )
}
