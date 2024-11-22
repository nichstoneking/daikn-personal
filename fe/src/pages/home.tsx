import { useState } from "react";
import Footer from "../components/footer.tsx";
import Ascii from "../components/ascii.tsx";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function Home() {
  const [completed, setCompleted] = useState([
    {
      label: "Bishouji",
      href: "https://github.com/daikonk/amiami-bot",
      target: "_blank",
      info: "a discord bot that allows you to get the last 10 figures posted on amiami, and other random utilities like JPY to USD for figure prices",
      expanded: false,
    },
    {
      label: "MIPS Maze",
      href: "https://github.com/daikonk/mips-maze",
      target: "_blank",
      info: "a maze game with randomly placed keys written in MIPS Assembly (my first exposure to programming)",
      expanded: false,
    },
  ]);

  const [tempData, setTempData] = useState({ data: "", index: 0 });

  const [inProgress, setInProgress] = useState([
    {
      label: "This site",
      link: "/",
      info: "my first (not completely scrapped together) website that i designed on my own with new frameworks (gin go and vite react) to showcase stuff",
      owner: "daikonk",
      repo: "daikn-personal",
      expanded: false,
      chartData: [
        { month: "Jan", commits: 65 },
        { month: "Feb", commits: 59 },
        { month: "Mar", commits: 80 },
        { month: "Apr", commits: 81 },
        { month: "May", commits: 56 },
        { month: "Jun", commits: 55 },
        { month: "Jul", commits: 40 },
        { month: "Aug", commits: 48 },
        { month: "Sep", commits: 52 },
        { month: "Oct", commits: 69 },
        { month: "Nov", commits: 75 },
        { month: "Dec", commits: 88 },
      ],
      apiLoading: false,
      apiData: {
        recent: 12,
        increase: 1.34,
        monthly: [0, 0, 0, 0, 0, 0, 0, 0, 10, 0, 0, 0],
        accessed: "2024-11-20",
      },
    },
    // {
    //   label: "Mocktalk",
    //   link: "https://github.com/daikonk/mocktalk",
    //   info: "a mock interview platform for programmers that helps you clearly dictate your thought-process as you problem solve",
    //   owner: "daikonk",
    //   repo: "mocktalk",
    //   expanded: false,
    // },
    // {
    //   label: "Go Interpreter",
    //   link: "https://github.com/daikonk/go_interpreter",
    //   info: "a basic code interpreter written in go, my first exposure to go (and TDD)",
    //   owner: "daikonk",
    //   repo: "go_interpreter",
    // },
  ]);

  const other = [
    {
      label: "- Vim config (catppuccin) -",
      href: "",
      target: "_blank",
      info: "i usually jump between this config on nvim/lazyvim, or use vim binds with intellij",
    },
  ];

  // function handleLoadingChange(index) {
  //   const nextLoading = inProgress.map((c, i) => {
  //     if (i === index) {
  //       // Increment the clicked counter
  //       c.apiLoading = !c.apiLoading;
  //       return c;
  //     } else {
  //       // The rest haven't changed
  //       return c;
  //     }
  //   });
  //   setInProgress(nextLoading);
  // }

  const variants = {
    initial: { height: 0, opacity: 0 },
    animate: { height: "auto", opacity: 1 },
    exit: { height: 0, opacity: 0 },
    transition: { type: "spring", duration: 0.4 },
  };

  useState(() => {
    console.log(tempData);
    const nextLoading = inProgress.map((c, i) => {
      if (i === tempData.index) {
        // Increment the clicked counter
        c.apiLoading = !c.apiLoading;
        c.expanded = !c.expanded;
        c.apiData = tempData;
        return c;
      } else {
        // The rest haven't changed
        return c;
      }
    });
    setInProgress(nextLoading);
  }, [tempData, setTempData]);

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
          className="px-2 mt-4 font-monaspice text-sm text-start hover:bg-[#141717] duration-300 hover:rounded-[4px] py-3 cursor-pointer overflow-hidden"
          onClick={() => {
            async function fetchData() {
              const response = await fetch("http://localhost:8080/repo", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  owner: item.owner,
                  repo: item.repo,
                }),
              });
              const data = await response.json();
              console.log("reached data");
              setTempData({ data: data, index: index });
            }
            fetchData();
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
              <div className="text-end text-sm text-gray-500">2024-01-20</div>
            </div>
            <AnimatePresence>
              {item.expanded && (
                <motion.div
                  variants={variants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="w-full"
                >
                  <hr
                    className="mb-4 mt-4 w-full"
                    style={{ borderTop: "2px solid white" }}
                  />
                  {item.apiLoading ? (
                    <div className="h-[256px] w-full flex items-center">
                      <span className="loader mx-auto"></span>
                    </div>
                  ) : (
                    <>
                      <div className="flex px-6 rounded-lg font-monaspice w-full">
                        {/* Stats Column */}
                        <div className="w-1/3 pr-4 flex flex-col items-center justify-evenly">
                          <div className="flex flex-col items-center">
                            <div className="text-center text-base text-gray-500">
                              Commits this Month
                            </div>
                            <div className="text-xl text-blue-600 mb-1">
                              {item.apiData.recent}
                            </div>
                            <span className="text-xs text-green-600">
                              {item.apiData.increase * 100}%
                            </span>
                          </div>
                        </div>

                        {/* Chart Column */}
                        <div className="w-2/3 h-64 flex items-center text-sm">
                          <ResponsiveContainer width="95%" height="80%">
                            <LineChart data={item.chartData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="month" />
                              <YAxis />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: "rgb(55 65 81)",
                                }}
                              />
                              <Line
                                type="monotone"
                                dataKey="commits"
                                stroke="#8884d8"
                                strokeWidth={2}
                                dot={{ r: 4 }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </>
                  )}
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
        <p className="mt-4 font-monaspice text-sm text-end">
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
        </p>
      ))}
      <hr className="my-10" style={{ borderTop: "2px solid white" }} />
      <p className="mt-8 font-monaspice text-center">Other</p>
      {other.map((item, index) => (
        <p className="mt-4 font-monaspice text-sm text-center">
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
        </p>
      ))}
      <Ascii />
      <Footer />
    </>
  );
}

export default Home;
