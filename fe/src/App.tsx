import React, { useRef } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home.tsx";
import Navbar from "./components/navbar.tsx";

const App: React.FC = () => {
  const homeRef = useRef<HTMLHRElement | null>(null);
  const projectRef = useRef<HTMLHRElement | null>(null);
  const otherRef = useRef<HTMLHRElement | null>(null);

  const navItems = [
    { label: "Home", href: "/", ref: homeRef },
    { label: "Projects", href: "/", ref: projectRef },
    { label: "Other", href: "/", ref: otherRef }
  ];

  return (
      <div className="flex flex-row justify-center text-white bg-[#111313] overflow-auto">
        <div className="sm:w-[600px] w-[300px] h-screen justify-self-center text-center">
          <BrowserRouter>
            <Navbar items={navItems} />
            <Routes>
              <Route path="/" element={<Home items={navItems} />} />
            </Routes>
          </BrowserRouter>
        </div>
      </div>
  );
};

export default App;