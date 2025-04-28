"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { Project } from "@/types/projects";

interface DeleteProjectDialogProps {
  project: Project;
  onDeleted?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export function DeleteProjectDialog({
  project,
  onDeleted,
  open: openProp,
  onOpenChange: onOpenChangeProp,
  children,
}: DeleteProjectDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = openProp !== undefined ? openProp : internalOpen;
  const onOpenChange = onOpenChangeProp !== undefined ? onOpenChangeProp : setInternalOpen;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/project/${project.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to delete project");
      toast.success("Project deleted");
      onDeleted?.();
      onOpenChange(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to delete project");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Project</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <b>{project.title}</b>? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        {error && <div className="text-destructive text-sm mb-2">{error}</div>}
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="ghost" disabled={loading}>Cancel</Button>
          </DialogClose>
          <Button type="button" variant="destructive" disabled={loading} onClick={handleDelete}>
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
