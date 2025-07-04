import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-purple-800 px-6 py-4 flex justify-between items-center shadow-lg">
      <Link to="/" className="text-2xl font-bold text-white tracking-wide">ChurPay</Link>
      <div className="flex gap-6">
        <Link className="text-white hover:text-yellow-400 transition" to="/features">Features</Link>
        <Link className="text-white hover:text-yellow-400 transition" to="/pricing">Pricing</Link>
        <Link className="text-white hover:text-yellow-400 transition" to="/about">About</Link>
        <Link className="text-white hover:text-yellow-400 transition" to="/faq">FAQ</Link>
      </div>
      <Link className="bg-yellow-400 text-purple-800 font-semibold px-4 py-2 rounded-xl shadow hover:bg-yellow-300 transition ml-4" to="/signup">
  Sign Up
</Link>
    </nav>
  );
}