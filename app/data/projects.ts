import type { Project } from "../types/project";

/**
 * Source of truth for everything listed on the home page.
 *
 * Accessed through `repository.ts` rather than imported directly, so this can
 * be swapped for a database without touching any call site.
 */

export const projects: Project[] = [
  {
    slug: "chi-board",
    label: "Chi Agent",
    href: "/",
    status: "in-progress",
    info: "Started as a self-hosted web dashboard, became an agent that interacts with my obsidian and has autonomous control over a few parts of my life",
    external: false,
    repo: { owner: "nichstoneking", name: "chi-board" },
    order: 0,
  },
  {
    slug: "annotation-extension",
    label: "Annotate",
    href: "/",
    status: "in-progress",
    info: "Small chrome extension allowing tech leads to annotate, comment, and interact on articles they want to share to their teams",
    external: false,
    repo: { owner: "nichstoneking", name: "annotation-extension" },
    order: 1,
  },
  {
    slug: "daikn-personal",
    label: "This site",
    href: "/",
    status: "in-progress",
    info: "Simple webapp originally on vite/react + go -> nextjs + vercel edge functions",
    external: false,
    repo: { owner: "nichstoneking", name: "daikn-personal" },
    order: 2,
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
    info: "Zed + Pi",
    external: false,
    order: 0,
  },
];
