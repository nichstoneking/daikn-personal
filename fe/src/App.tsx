import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home.tsx";
import Navbar from "./components/navbar.tsx";

const App = () => {
  //const navItems = [
  //  { label: "Home", href: "/" },
  //  { label: "Projects", href: "/" },
  //  { label: "Other", href: "/" },
  //];
  return (
    <div className="flex flex-row justify-center text-white bg-[#111313] overflow-auto">
      <div className="sm:w-[600px] w-[300px] h-screen justify-self-center text-center">
        <Navbar />
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
