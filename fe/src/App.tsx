import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home.tsx";
import Analytics from "./pages/analytics.tsx";
import Navbar from "./components/navbar.tsx";

const App = () => {
  const navItems = [
    { label: "Home", href: "/" },
    { label: "Stats", href: "/stats" },
    { label: "Projects", href: "/projects" },
  ];
  return (
    <div className="flex flex-row justify-center text-white bg-[#111313] overflow-auto">
      <div className="w-[600px] h-screen justify-self-center text-center">
        <Navbar items={navItems} logo="./assets/react.svg" />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/stats" element={<Analytics />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
};

export default App;
