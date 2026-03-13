import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { FaChartLine } from "react-icons/fa6";
import useAuth from "../hooks/useAuth";

const Navbar = () => {
  const { logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/60 border-b border-white/30 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}

        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-bold text-blue-900"
        >
          <FaChartLine className="text-blue-600" />
          Social Strategy
        </Link>

        {/* Navigation */}

        <div className="flex items-center gap-6 text-sm">
          <Link to="/" className="text-gray-700 hover:text-blue-600">
            Home
          </Link>

          <Link to="/brands" className="text-gray-700 hover:text-blue-600">
            Brands
          </Link>

          <button
            onClick={logout}
            className="flex items-center gap-2 text-gray-700 hover:text-red-500"
          >
            <FaUserCircle size={20} />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
