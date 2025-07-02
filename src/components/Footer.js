import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-purple-900 text-yellow-300 py-6 mt-auto">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm">
        <div className="mb-4 md:mb-0">
          ChurPay &copy; {new Date().getFullYear()} | Built for the Faith Community
        </div>
        <div className="flex gap-6">
          <Link to="/features" className="hover:text-yellow-400 transition">
            Features
          </Link>
          <Link to="/pricing" className="hover:text-yellow-400 transition">
            Pricing
          </Link>
          <Link to="/about" className="hover:text-yellow-400 transition">
            About
          </Link>
          <Link to="/faq" className="hover:text-yellow-400 transition">
            FAQ
          </Link>
        </div>
      </div>
    </footer>
  );
}