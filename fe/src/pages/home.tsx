import { useState } from "react";
import Footer from "../components/footer.tsx";
import Ascii from "../components/ascii.tsx";
import InProgressRepo from "../components/inprogress_repo.tsx";

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
  const inProgress = [
    {
      label: "Mocktalk",
      href: "https://mocktalk.app",
      target: "_blank",
      info: "a mock interview platform for programmers that helps you clearly dictate your thought-process as you problem solve",
      images: [{ src: "./assets/bleh.jpg", title: "" }],
    },
  ];

  const other = [
    {
      label: "- Vim config (catppuccin) -",
      href: "",
      target: "_blank",
      info: "i usually jump between this config on nvim/lazyvim, or use vim binds with intellij",
    },
  ];

  // const nextCounters = counters.map((c, i) => {
  //   if (i === index) {
  //     // Increment the clicked counter
  //     return c + 1;
  //   } else {
  //     // The rest haven't changed
  //     return c;
  //   }
  // });

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
        <p
          className="mt-4 font-monaspice text-sm text-start hover:bg-[#141717] duration-300 py-3 cursor-pointer"
          onClick={() => {}}
        >
          <div className="flex flex-col gap-4 text-sm font-medium items-start">
            <a
              key={index}
              href={item.href}
              target={item.target}
              className="text-[#3F51B5] hover:text-[#334296] rounded-md text-sm font-medium"
            >
              {item.label}
            </a>
            {item.expanded ? <InProgressRepo className="w-full" /> : <></>}
            <p>{item.info}</p>
          </div>
        </p>
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
