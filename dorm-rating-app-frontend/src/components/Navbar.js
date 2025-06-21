import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';

const Navbar = () => {
  const location = useLocation();
  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/dorms', label: 'Dorms' },
    { path: '/marketplace', label: 'Rent/Buy' },
    { path: '/chat', label: 'Chat' },
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Logo />
          <span className="ml-2 text-xl font-bold">DormHub</span>
        </div>
        <ul className="flex space-x-6">
          {navLinks.map(({ path, label }) => (
            <li key={path}>
              <Link
                to={path}
                className={`hover:text-blue-200 ${location.pathname === path ? 'border-b-2 border-white' : ''}`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
