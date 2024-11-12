import React from "react";
import { Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full py-6 mt-auto font-monaspice">
      <div className="container mx-auto px-4">
        <div className="flex flex-row justify-center gap-2">
          <div className="flex items-center space-x-6">
            <a
              href="https://github.com/daikonk"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 hover:text-white transition-colors duration-200"
            >
              <Github size={20} />
              <span className="text-sm">GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
