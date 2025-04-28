"use client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useEffect } from "react";
import useSWR, { mutate } from "swr";
import type { Project } from "@/types/projects";
import { HubLayout } from "@/components/hub-layout";
import { fetcher } from "@/lib/utils";
import { CreateProjectDialog } from "@/components/projects/create-project-dialog";
import { ProjectsList } from "@/components/projects/projects-list";

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
        <CreateProjectDialog onCreated={() => mutate("/api/project")}>
          <Button>Create Project</Button>
        </CreateProjectDialog>
      }
    >
      <ProjectsList projects={data?.projects} isLoading={isLoading} />
    </HubLayout>
  );
}