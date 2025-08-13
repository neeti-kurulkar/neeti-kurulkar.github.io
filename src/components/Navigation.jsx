// src/components/Navigation.jsx
import { useState } from 'react';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="font-[Open_Sans] fixed top-6 left-1/2 -translate-x-1/2 max-w-7xl w-[95%] bg-[#183D3D]/40 backdrop-blur-lg rounded-full shadow-lg border-b border-gray-800 z-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold text-[#D5F0E5]">
            Neeti Kurulkar
          </div>

          <div className="hidden md:flex space-x-8">
            <a href="#work" className="text-[#D5F0E5]/75 hover:text-white transition-colors">Work</a>
            <a href="#about" className="text-[#D5F0E5]/75 hover:text-white transition-colors">About</a>
            <a href="#contact" className="text-[#D5F0E5]/75 hover:text-white transition-colors">Contact</a>
          </div>

          <button
            className="md:hidden text-gray-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-800 pt-4">
            <div className="flex flex-col space-y-3">
              <a href="#work" className="text-gray-300 hover:text-white">Work</a>
              <a href="#about" className="text-gray-300 hover:text-white">About</a>
              <a href="#contact" className="text-gray-300 hover:text-white">Contact</a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;