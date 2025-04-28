"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useEffect } from "react";
import useSWR, { mutate } from "swr";
import { ArrowRight } from "lucide-react";
import type { Project } from "@/types/projects";
import { HubLayout } from "@/components/hub-layout";
import { fetcher } from "@/lib/utils";
import Link from "next/link";
import { HubCreateProjectDialog } from "@/components/hub-create-project-dialog";

export default function ProjectsPage() {
  const { data, error, isLoading } = useSWR<{ projects: Project[] }>("/api/project", fetcher);

  useEffect(() => {
    if (error) toast.error("Failed to load projects");
  }, [error]);

  return (
    <HubLayout
      title={<span className="flex items-center gap-2">Projects</span>}
      description="A list of your AI project workspaces."
      breadcrumbs={[{ label: "Hub", href: "/hub" }, { label: "Projects" }]}
      actions={
        <HubCreateProjectDialog onCreated={() => mutate("/api/project")}>
          <Button>Create Project</Button>
        </HubCreateProjectDialog>
      }
    >
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        {isLoading ? (
          [...Array(2)].map((_, i) => <Skeleton key={i} className="h-32" />)
        ) : data?.projects?.length ? (
          data.projects.map((project) => <ProjectCard key={project.id} project={project} />)
        ) : (
          <div className="col-span-2 text-muted-foreground text-center py-8">
            No projects found.
          </div>
        )}
      </div>
    </HubLayout>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {project.title}
          <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm mb-2 line-clamp-2">{project.description ?? "No description"}</p>
        <div className="flex justify-end">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/hub/projects/${project.id}`}>Open</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
