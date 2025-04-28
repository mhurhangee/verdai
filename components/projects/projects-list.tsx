import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Edit2, Trash2 } from "lucide-react";
import type { Project } from "@/types/projects";
import Link from "next/link";
import { EditProjectDialog } from "@/components/projects/edit-project-dialog";
import { DeleteProjectDialog } from "@/components/projects/delete-project-dialog";
import { mutate } from "swr";
import { formatDate } from "@/lib/utils";

interface ProjectsListProps {
  projects?: Project[];
  isLoading?: boolean;
}

export function ProjectsList({ projects, isLoading }: ProjectsListProps) {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
      {isLoading ? (
        [...Array(4)].map((_, i) => <Skeleton key={i} className="h-40" />)
      ) : projects?.length ? (
        projects.map((project) => <ProjectCard key={project.id} project={project} />)
      ) : (
        <div className="col-span-2 text-muted-foreground text-center py-8">
          No projects found.
        </div>
      )}
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="hover:shadow-lg transition-shadow group relative">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link href={`/hub/projects/${project.id}`} className="flex items-center gap-2">
            {project.title}
            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" />
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm mb-2 line-clamp-2">{project.description ?? "No description"}</p>
        <p className="text-muted-foreground text-sm mb-2">{formatDate(project.createdAt)}</p>
        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <EditProjectDialog project={project} onUpdated={() => mutate('/api/project')}>
            <Button size="icon" variant="ghost" className="text-muted-foreground" aria-label="Edit project">
              <Edit2 className="w-4 h-4" />
            </Button>
          </EditProjectDialog>
          <DeleteProjectDialog project={project} onDeleted={() => mutate('/api/project')}>
            <Button size="icon" variant="ghost" className="text-destructive" aria-label="Delete project">
              <Trash2 className="w-4 h-4" />
            </Button>
          </DeleteProjectDialog>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/hub/projects/${project.id}`}>Open</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
