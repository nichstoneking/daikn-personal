export type ProjectStatus = "in-progress" | "completed" | "other";

export interface ProjectRepo {
  owner: string;
  name: string;
}

export interface Project {
  slug: string;
  label: string;
  href: string;
  status: ProjectStatus;
  info: string;
  external: boolean;
  repo?: ProjectRepo;
  order: number;
}
