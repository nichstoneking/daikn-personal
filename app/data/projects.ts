import type { Project } from "../types/project";

/**
 * Source of truth for everything listed on the home page.
 *
 * Accessed through `repository.ts` rather than imported directly, so this can
 * be swapped for a database without touching any call site.
 */
export const projects: Project[] = [
  {
    slug: "daikn-personal",
    label: "This site",
    href: "/",
    status: "in-progress",
    info: "my first (not completely scrapped together) website that new frameworks (originally gin go and vite react, migrated to ts vercel functions and next) to showcase progress and projects.",
    external: false,
    repo: { owner: "nichstoneking", name: "daikn-personal" },
    order: 0,
  },
  {
    slug: "bishouji",
    label: "Bishouji",
    href: "https://github.com/nichstoneking/amiami-bot",
    status: "completed",
    info: "a discord bot that allows you to get the last 10 figures posted on amiami, and other random utilities like JPY to USD for figure prices",
    external: true,
    order: 0,
  },
  {
    slug: "mips-maze",
    label: "MIPS Maze",
    href: "https://github.com/nichstoneking/mips-maze",
    status: "completed",
    info: "a maze game with randomly placed keys written in MIPS Assembly (my first exposure to programming)",
    external: true,
    order: 1,
  },
  {
    slug: "sports-matchup",
    label: "Sports-Matchup Website",
    href: "https://github.com/nichstoneking/sports-matchup",
    status: "completed",
    info: "first collaborative web project, a match-up site for local sports enthusiasts",
    external: true,
    order: 2,
  },
  {
    slug: "catt-interpreter",
    label: "Catt Interpreter",
    href: "https://catt-site.vercel.app/",
    status: "completed",
    info: "a code interpreter for a pet language. uses a few build-ins made on-top of api requests, also has a basic LSP (wip pushed to later)",
    external: true,
    order: 3,
  },
  {
    slug: "mocktalk",
    label: "Mocktalk",
    href: "https://mocktalk.app",
    status: "completed",
    info: "a mock interview platform for programmers that helps you clearly dictate your thought-process as you problem solve",
    external: true,
    order: 4,
  },
  {
    slug: "dev-configs",
    label: "IDE/Development Configs",
    href: "",
    status: "other",
    info: "Zed + Ghostty + CC/Cursor Agent CLI",
    external: false,
    order: 0,
  },
];
