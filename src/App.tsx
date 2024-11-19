import "./App.css";
import Navbar from "./components/navbar.tsx";
import Footer from "./components/footer.tsx";
import Ascii from "./components/ascii.tsx";

function App() {
  const navItems = [
    { label: "Home", href: "/" },
    { label: "Other", href: "/other" },
    { label: "Projects", href: "/projects" },
  ];

  const inProgress = [
    {
      label: "Mocktalk",
      href: "https://mocktalk.app",
      target: "_blank",
      info: "a mock interview platform for programmers that helps you clearly dictate your thought-process as you problem solve",
      images: [{ src: "./assets/bleh.jpg", title: "" }],
    },
    {
      label: "Go Interpreter",
      href: "https://github.com/daikonk/go_interpreter",
      target: "_blank",
      info: "a basic code interpreter written in go, my first exposure to go (and TDD)",
      images: [{ src: "./assets/bleh.jpg", title: "" }],
    },
  ];

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
      href: "",
      target: "_blank",
      info: "i usually jump between this config on nvim/lazyvim, or use vim binds with intellij",
    },
  ];

  return (
    <div className="flex flex-row justify-center text-white bg-[#111313] overflow-scroll">
      <div className="w-[600px] h-screen justify-self-center text-center">
        <Navbar items={navItems} logo="./assets/react.svg" />
        <hr className="mb-10 mt-5" style={{ borderTop: "2px solid white" }} />
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
          i plan to document my journey in SWE, ML, and any other
          entrepreneurial ventures.
        </p>
        <p className="mt-14 font-monaspice text-end">About me</p>
        <p className="mt-4 font-monaspice text-sm text-end">
          i'm currently inbetween a CS and CE degree, and building random stuff
          in my free time
        </p>
        <p className="mt-4 font-monaspice text-sm text-end">
          something that really pushed me further into development is the
          ability to make stuff with little constraints and little cost
        </p>
        <hr className="my-10" style={{ borderTop: "2px solid white" }} />
        <p className="mt-8 font-monaspice text-start">In progress</p>
        {inProgress.map((item, index) => (
          <p className="mt-4 font-monaspice text-sm text-start">
            <div className="flex flex-col gap-4 text-sm font-medium items-start">
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
      </div>
    </div>
  );
}

export default App;
