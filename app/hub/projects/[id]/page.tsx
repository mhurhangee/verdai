"use client"
import { useParams } from "next/navigation"
import { HubLayout } from "@/components/hub-layout"
import { ProjectActions } from "@/components/projects/project-actions"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { FolderClosed, CalendarDays, Tags, FileText } from "lucide-react"
import { formatDate } from "@/lib/utils"
import useSWR from 'swr'
import { useRouter } from 'next/navigation'

function ProjectFiles() {
  return <div className="border rounded p-4 text-muted-foreground">[Files will be shown here]</div>
}
function ProjectChats() {
  return <div className="border rounded p-4 text-muted-foreground">[Chats will be shown here]</div>
}

export default function ProjectDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { data, error, isLoading, mutate } = useSWR(id ? `/api/project/${id}` : null, (url) => fetch(url).then(res => res.json()))
  const project = data?.project

  // Handler for after edit
  function handleUpdated() {
    mutate()
  }

  // Handler for after delete
  function handleDeleted() {
    router.push('/hub/projects')
  }

  return (
    <HubLayout
      title={
        <span className="flex items-center gap-2">
          <FolderClosed className="w-5 h-5 text-muted-foreground" />
          {isLoading ? <Skeleton className="w-32 h-6" /> : project?.title || "Project"}
        </span>
      }
      description={isLoading ? (
        <span className="inline-block align-middle"><Skeleton className="w-48 h-4" /></span>
      ) : project?.description || "No description"}
      breadcrumbs={[
        { label: "Projects", href: "/hub/projects" },
        { label: isLoading ? "..." : project?.title || "Project" },
      ]}
      actions={project && <ProjectActions project={project} showOpenButton={false} onUpdated={handleUpdated} onDeleted={handleDeleted} />}
    >
      {isLoading ? (
        <Skeleton className="w-full h-40" />
      ) : error ? (
        <div className="text-destructive">{error.message || error.toString()}</div>
      ) : project ? (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <CalendarDays className="w-4 h-4" />
                <span>{formatDate(project.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Tags className="w-4 h-4" />
                {project.tags?.length ? project.tags.map((tag: string) => (
                  <Badge variant="outline" key={tag}>{tag}</Badge>
                )) : <span>No tags</span>}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2"><FileText className="w-4 h-4" /> Files</h3>
            <ProjectFiles />
            <h3 className="font-semibold flex items-center gap-2"><FileText className="w-4 h-4" /> Chats</h3>
            <ProjectChats />
          </div>
        </div>
      ) : null}
    </HubLayout>
  )
}