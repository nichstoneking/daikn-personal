import type { Project, ProjectStatus } from "../types/project";
import { projects } from "./projects";

/**
 * Data access for projects.
 *
 * Backed by a local module today. These are async so that swapping in a real
 * database later is a change to this file alone — every call site already
 * awaits, so no signatures move.
 */

const byOrder = (a: Project, b: Project) => a.order - b.order;

export async function getProjects(): Promise<Project[]> {
  return [...projects].sort(byOrder);
}

export async function getProjectsByStatus(
  status: ProjectStatus
): Promise<Project[]> {
  return projects.filter((p) => p.status === status).sort(byOrder);
}

export async function getProject(slug: string): Promise<Project | undefined> {
  return projects.find((p) => p.slug === slug);
}
