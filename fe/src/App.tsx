import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home.tsx";
import Navbar from "./components/navbar.tsx";

const App = () => {
  const navItems = [
    { label: "Home", href: "/" },
    { label: "Projects", href: "/" },
    { label: "Other", href: "/" },
  ];
  return (
    <div className="flex flex-row justify-center text-white bg-[#111313] overflow-auto">
      <div className="w-[600px] h-screen justify-self-center text-center">
        <Navbar items={navItems} logo="./assets/react.svg" />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
};

export default App;
