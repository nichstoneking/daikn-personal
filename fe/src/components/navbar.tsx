import React, { useState } from "react";

interface NavItem {
  label: string;
  href: string;
}

interface NavbarProps {
  logo?: string;
  items: NavItem[];
}

//const Navbar: React.FC<NavbarProps> = ({ items }) => {
//  const [isOpen, setIsOpen] = useState(false);

  //const toggleMenu = () => {
  //  setIsOpen(!isOpen);
  //};
const Navbar = () => {
  return (
    <nav>
      <hr className="mb-10 mt-5" style={{ borderTop: "2px solid white" }} />
    </nav>
  );
};

      //<div className="flex items-end max-w-6xl mx-auto h-16">
      //  {/* Desktop Navigation */}
      //  <div className="w-full flex-row hidden sm:flex font-monaspice justify-center gap-24">
      //    {items.map((item, index) => (
      //      <a
      //        key={index}
      //        href={item.href}
      //        className="text-white hover:text-gray-400 rounded-md text-sm font-medium"
      //      >
      //        {item.label}
      //      </a>
      //    ))}
      //  </div>
      //
      //  {/* Mobile Navigation Button */}
      //  <div className="sm:hidden">
      //    <button
      //      onClick={toggleMenu}
      //      className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none"
      //    >
      //      <svg
      //        className="h-6 w-6"
      //        xmlns="http://www.w3.org/2000/svg"
      //        fill="none"
      //        viewBox="0 0 24 24"
      //        stroke="currentColor"
      //      >
      //        {isOpen ? (
      //          <path
      //            strokeLinecap="round"
      //            strokeLinejoin="round"
      //            strokeWidth={2}
      //            d="M6 18L18 6M6 6l12 12"
      //          />
      //        ) : (
      //          <path
      //            strokeLinecap="round"
      //            strokeLinejoin="round"
      //            strokeWidth={2}
      //            d="M4 6h16M4 12h16M4 18h16"
      //          />
      //        )}
      //      </svg>
      //    </button>
      //  </div>
      //</div>
      //
      //{/* Mobile Navigation Menu */}
      //{isOpen && (
      //  <div className="sm:hidden">
      //    <div className="px-2 pt-2 pb-3 space-y-1">
      //      {items.map((item, index) => (
      //        <a
      //          key={index}
      //          href={item.href}
      //          className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
      //        >
      //          {item.label}
      //        </a>
      //      ))}
      //    </div>
      //  </div>
      //)}


export default Navbar;
