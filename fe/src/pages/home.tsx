import { useState } from "react";
import Footer from "../components/footer.tsx";
import Ascii from "../components/ascii.tsx";
import InProgressRepo from "../components/inprogress_repo.tsx";
import { motion, AnimatePresence } from "framer-motion";

function Home() {
  const [inProgressDates, setInProgressDates] = useState(["", "", ""]);

  const [inProgress, setInProgress] = useState([
    {
      label: "This site",
      link: "/",
      info: "my first (not completely scrapped together) website that i designed on my own with new frameworks (gin go and vite react) to showcase stuff",
      owner: "daikonk",
      repo: "daikn-personal",
      expanded: false,
    },
    {
      label: "Mocktalk",
      link: "https://github.com/daikonk/mocktalk",
      info: "a mock interview platform for programmers that helps you clearly dictate your thought-process as you problem solve",
      owner: "daikonk",
      repo: "mocktalk",
      expanded: false,
    },
    {
      label: "Go Interpreter",
      link: "https://github.com/daikonk/go_interpreter",
      info: "a basic code interpreter written in go, my first exposure to go (and TDD)",
      owner: "daikonk",
      repo: "go_interpreter",
      expanded: false,
    },
  ]);

  const completed = [
    {
      label: "Bishouji",
      href: "https://github.com/daikonk/amiami-bot",
      target: "_blank",
      info: "a discord bot that allows you to get the last 10 figures posted on amiami, and other random utilities like JPY to USD for figure prices",
    },
    {
      label: "MIPS Maze",
      href: "https://github.com/daikonk/mips-maze",
      target: "_blank",
      info: "a maze game with randomly placed keys written in MIPS Assembly (my first exposure to programming)",
    },
  ];

  const other = [
    {
      label: "- Vim config (catppuccin) -",
      href: "https://github.com/daikonk/nvim",
      target: "_blank",
      info: "i usually jump between this config on nvim/lazyvim, or use vim binds with intellij",
    },
  ];

  return (
    <>
      <p className="mt-8 font-monaspice text-start">Hi, i'm Nick</p>
      <p className="mt-4 font-monaspice text-sm text-start">
        this was something that i've been wanting to do for a long time, and
        decided to just start it after i saw{" "}
        <a
          className="text-[#3F51B5] hover:underline"
          target="_blank"
          href="https://lelouch.dev/"
        >
          this
        </a>
      </p>
      <p className="mt-4 font-monaspice text-sm text-start">
        i plan to document my journey in SWE, ML, and any other entrepreneurial
        ventures.
      </p>
      <p className="mt-14 font-monaspice text-end">About me</p>
      <p className="mt-4 font-monaspice text-sm text-end">
        i'm currently inbetween a CS and CE degree, and building random stuff in
        my free time
      </p>
      <p className="mt-4 font-monaspice text-sm text-end">
        something that really pushed me further into development is the ability
        to make stuff with little constraints and little cost
      </p>
      <hr className="my-10 w-full" style={{ borderTop: "2px solid white" }} />
      <p className="mt-8 font-monaspice text-start">In progress</p>
      {inProgress.map((item, index) => (
        <div
          key={index}
          className="px-2 mt-4 font-monaspice text-sm text-start hover:bg-[#141717] duration-300 hover:rounded-[4px] py-3 cursor-pointer overflow-hidden"
          onClick={() => {
            const nextInProgress = inProgress.map((c, i) => {
              if (i === index) {
                // Increment the clicked counter
                c.expanded = !c.expanded;
                return c;
              } else {
                // The rest haven't changed
                return c;
              }
            });
            setInProgress(nextInProgress);
          }}
        >
          <div className="flex flex-col text-sm font-medium items-start">
            <div className="font-monaspice flex justify-between text-sm w-full mb-4">
              <a
                className="text-start text-sm text-[#3F51B5] hover:text-[#334296] active:text-blue-800"
                target="_blank"
                href={item.link}
              >
                {item.label}
              </a>
              <div className="text-end text-sm text-gray-500 ease-in">
                {inProgressDates[index]}
              </div>
            </div>
            <AnimatePresence>
              {item.expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="w-full"
                >
                  <InProgressRepo
                    owner={item.owner}
                    repo={item.repo}
                    setDates={setInProgressDates}
                    dates={inProgressDates}
                    index={index}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <p>{item.info}</p>
          </div>
        </div>
      ))}
      <hr className="my-10" style={{ borderTop: "2px solid white" }} />
      <p className="mt-8 font-monaspice text-end">Completed/Ended</p>
      {completed.map((item, index) => (
        <div key={index} className="mt-4 font-monaspice text-sm text-end">
          <div className="flex flex-col gap-4 text-sm font-medium items-end">
            <a
              key={index}
              href={item.href}
              target={item.target}
              className="text-[#3F51B5] hover:text-[#334296] rounded-md text-sm font-medium"
            >
              {item.label}
            </a>
            <p>{item.info}</p>
          </div>
        </div>
      ))}
      <hr className="my-10" style={{ borderTop: "2px solid white" }} />
      <div className="mt-8 font-monaspice text-center">Other</div>
      {other.map((item, index) => (
        <div key={index} className="mt-4 font-monaspice text-sm text-center">
          <div className="flex flex-col gap-4 text-sm font-medium text-gray-600 items-center">
            <a
              key={index}
              href={item.href}
              target={item.target}
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

export default Home;
