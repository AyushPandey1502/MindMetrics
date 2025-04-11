import React from 'react';
import { Link } from 'react-router-dom';
import Logo from "../svgs/logo_mm.png";

function Navbar() {
  return (
    <nav className="flex justify-between items-center p-4 bg-[#f0f8ff] shadow-md text-xl font-bold position">
      <div className="flex items-center">
        <Link to="/" className="flex items-center">
          <img
            src={Logo}
            alt="Logo"
            style={{ width: 55 * 1.11, height: 55 }}
          />
          <div className="ml-2 flex flex-col">
            <span className="text-black">MindMetrics</span>
            <span className="text-gray-500 text-sm font-normal">
              Track the Mind, Transform the Life.
            </span>
          </div>
        </Link>
      </div>
      <ul className="flex items-center space-x-6">
        <li>
          <Link to="/" className="text-gray-700 hover:text-blue-500 transition-colors">Home</Link>
        </li>
        <li>
          <Link to="/login" className="text-gray-700 hover:text-blue-500 transition-colors">Login</Link>
        </li>
        <li>
          <Link to="/aboutus" className="text-gray-700 hover:text-blue-500 transition-colors">About Us</Link>
        </li>
        <li>
          <Link to="/blogs" className="text-gray-700 hover:text-blue-500 transition-colors">Blogs</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;