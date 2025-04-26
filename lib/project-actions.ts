import { ApiError, handleApiResponse } from '@/lib/api-error'
import { Project } from '@/types/project'

export async function deleteProject(
  projectId: string,
  onSuccess?: () => void,
  onError?: (error: ApiError | Error) => void
): Promise<void> {
  try {
    const res = await fetch(`/api/projects/${projectId}`, { method: 'DELETE' })
    await handleApiResponse(res)
    if (onSuccess) onSuccess()
  } catch (error) {
    if (onError) onError(error instanceof ApiError ? error : new Error('Failed to delete project'))
  }
}

export async function editProject(
  projectId: string,
  updates: Partial<Omit<Project, 'id' | 'userId'>>,
  onSuccess?: () => void,
  onError?: (error: ApiError | Error) => void
): Promise<void> {
  try {
    const res = await fetch(`/api/projects/${projectId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
    await handleApiResponse(res)
    if (onSuccess) onSuccess()
  } catch (error) {
    if (onError) onError(error instanceof ApiError ? error : new Error('Failed to update project'))
  }
}

export async function createProject(
  projectData: Omit<Project, 'id' | 'userId' | 'createdAt' | 'updatedAt'>,
  onSuccess?: (project: Project) => void,
  onError?: (error: ApiError | Error) => void
): Promise<Project | null> {
  try {
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projectData),
    })
    const data = await handleApiResponse<{ project: Project; success: boolean }>(res)
    if (onSuccess && data.project) onSuccess(data.project)
    return data.project
  } catch (error) {
    if (onError) onError(error instanceof ApiError ? error : new Error('Failed to create project'))
    return null
  }
}

/**
 * Filter and sort projects
 */
export function filterAndSortProjects(
  projects: Project[],
  search: string,
  sort: 'name' | 'created' | 'edited',
  sortDir: 'asc' | 'desc'
): Project[] {
  let filteredProjects = [...projects]

  // Apply search filter
  if (search.trim()) {
    const q = search.trim().toLowerCase()
    filteredProjects = filteredProjects.filter(
      p =>
        p.projectName.toLowerCase().includes(q) ||
        (p.description?.toLowerCase().includes(q) ?? false)
    )
  }

  // Apply sorting
  filteredProjects.sort((a, b) => {
    if (sort === 'name') {
      return sortDir === 'asc'
        ? a.projectName.localeCompare(b.projectName)
        : b.projectName.localeCompare(a.projectName)
    } else if (sort === 'created') {
      return sortDir === 'asc'
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    } else {
      return sortDir === 'asc'
        ? new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
        : new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    }
  })

  return filteredProjects
}
