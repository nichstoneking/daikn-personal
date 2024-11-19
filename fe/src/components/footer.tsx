import { FaGithub, FaXTwitter } from "react-icons/fa6";

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
              <FaGithub />
              <span className="text-sm">GitHub</span>
            </a>
            <a
              href="https://x.com/daiikonk"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 hover:text-white transition-colors duration-200"
            >
              <FaXTwitter />
              <span className="text-sm">Twitter</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
