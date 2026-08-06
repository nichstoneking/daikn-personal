export type ProjectStatus = "in-progress" | "completed" | "other";

export interface ProjectRepo {
  owner: string;
  name: string;
}

export interface Project {
  /** Stable identifier — used as the React key and as a future DB primary key. */
  slug: string;
  label: string;
  href: string;
  status: ProjectStatus;
  info: string;
  /** Opens in a new tab; also drives rel="noopener noreferrer". */
  external: boolean;
  /** Present when the project should render commit activity. */
  repo?: ProjectRepo;
  /** Sort order within a status group, ascending. */
  order: number;
}
