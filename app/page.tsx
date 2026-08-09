import React from "react";
import Footer from "./components/footer";
import Ascii from "./components/ascii";
import Navbar from "./components/navbar";
import ProjectItem from "./components/project_item";
import { getProjectsByStatus } from "./data/repository";
import { getRepoStats } from "./lib/github";

export const revalidate = 3600;

const navItems = [
    { label: "Home", target: "home" },
    { label: "Projects", target: "projects" },
    { label: "Other", target: "other" },
];

export default async function Home() {
    const [inProgress, completed, other] = await Promise.all([
        getProjectsByStatus("in-progress"),
        getProjectsByStatus("completed"),
        getProjectsByStatus("other"),
    ]);

    const stats = await Promise.all(
        inProgress.map((p) =>
            p.repo ? getRepoStats(p.repo.owner, p.repo.name) : null
        )
    );

    return (
        <>
            <Navbar items={navItems} />
            <p className="mt-8 font-monaspice text-start">Hi, i&apos;m Nick</p>
            <p className="mt-4 font-monaspice text-sm text-start">
                this was something that I&apos;ve been wanting to do for a long
                time, and decided to just start it after i saw{" "}
                <a
                    className="text-[#3F51B5] hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://lelouch.dev/"
                >
                    this
                </a>
            </p>
            <p className="mt-4 font-monaspice text-sm text-start">
                I plan to document my journey in SWE, ML, and any other
                entrepreneurial ventures.
            </p>
            <p className="mt-14 font-monaspice text-end">About me</p>
            <p className="mt-4 font-monaspice text-sm text-end">
                I currently work full time in the AI Agent space, and enjoy
                building random things in my free time
            </p>
            <p className="mt-4 font-monaspice text-sm text-end">
                something that really pushed me further into development is the
                ability to make things with little constraints and little cost
            </p>
            <hr
                id="projects"
                className="my-10 w-full scroll-m-5"
                style={{ borderTop: "2px solid white" }}
            />
            <p className="mt-8 font-monaspice text-start">In progress</p>
            {inProgress.map((project, index) => (
                <ProjectItem
                    key={project.slug}
                    project={project}
                    stats={stats[index]}
                />
            ))}
            <hr className="my-10" style={{ borderTop: "2px solid white" }} />
            <p className="mt-8 font-monaspice text-end">Completed/Ended</p>
            {completed.map((item) => (
                <div
                    key={item.slug}
                    className="px-2 mt-4 font-monaspice text-sm text-end py-3 overflow-hidden"
                >
                    <div className="flex flex-col gap-4 text-sm font-medium items-end">
                        <a
                            href={item.href}
                            target={item.external ? "_blank" : undefined}
                            rel={
                                item.external ? "noopener noreferrer" : undefined
                            }
                            className="text-[#3F51B5] hover:text-[#334296] rounded-md text-sm font-medium"
                        >
                            {item.label}
                        </a>
                        <p>{item.info}</p>
                    </div>
                </div>
            ))}
            <hr
                id="other"
                className="my-10 scroll-m-5"
                style={{ borderTop: "2px solid white" }}
            />
            <div className="mt-8 font-monaspice text-center">Other</div>
            {other.map((item) => (
                <div
                    key={item.slug}
                    className="mt-4 font-monaspice text-sm text-center"
                >
                    <div className="flex flex-col gap-4 text-sm font-medium text-gray-600 items-center">
                        <a
                            href={item.href}
                            target={item.external ? "_blank" : undefined}
                            rel={
                                item.external ? "noopener noreferrer" : undefined
                            }
                            className="text-gray-600 hover:text-gray-700 rounded-md text-sm font-medium"
                        >
                            {item.label}
                        </a>
                        <p>{item.info}</p>
                    </div>
                </div>
            ))}
            <div className="overflow-hidden flex justify-center">
                <Ascii />
            </div>
            <Footer />
        </>
    );
}
