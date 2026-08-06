"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import type { Project } from "../types/project";
import type { RepositoryResponse } from "../types/api";

// Recharts is the heaviest dependency on the page and is only needed once a
// project is expanded, so keep it out of the initial bundle entirely.
const InProgressRepo = dynamic(() => import("./inprogress_repo"), {
  ssr: false,
  loading: () => (
    <div className="h-[256px] w-full flex items-center">
      <span className="loader mx-auto"></span>
    </div>
  ),
});

interface ProjectItemProps {
  project: Project;
  stats: RepositoryResponse | null;
}

const ProjectItem: React.FC<ProjectItemProps> = ({ project, stats }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="px-2 mt-4 font-monaspice text-sm text-start hover:bg-[#141717] duration-300 hover:rounded-[4px] py-3 cursor-pointer overflow-hidden"
      onClick={() => setExpanded((v) => !v)}
      role="button"
      tabIndex={0}
      aria-expanded={expanded}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setExpanded((v) => !v);
        }
      }}
    >
      <div className="flex flex-col text-sm font-medium items-start">
        <div className="font-monaspice flex justify-between text-sm w-full mb-4">
          {/* A link to the page you're already on just reloads and eats the
              toggle, so only render an anchor when it goes somewhere. */}
          {project.href && project.href !== "/" ? (
            <a
              className="text-start text-sm text-[#3F51B5] hover:text-[#334296] active:text-blue-800"
              target={project.external ? "_blank" : undefined}
              rel={project.external ? "noopener noreferrer" : undefined}
              href={project.href}
              onClick={(e) => e.stopPropagation()}
            >
              {project.label}
            </a>
          ) : (
            <span className="text-start text-sm text-[#3F51B5]">
              {project.label}
            </span>
          )}
          <div className="text-end text-sm text-gray-500 ease-in">
            {stats?.accessed ?? ""}
          </div>
        </div>
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              <InProgressRepo stats={stats} />
            </motion.div>
          )}
        </AnimatePresence>
        <p>{project.info}</p>
      </div>
    </div>
  );
};

export default ProjectItem;
