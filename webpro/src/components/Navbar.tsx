import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    setIsOpen(false);
  };

  const navItems = [
    { id: 'home', label: 'หน้าแรก' },
    { id: 'products', label: 'บริการของเรา' },
    { id: 'dorm-type', label: 'ประเภทห้องพัก' },
    { id: 'step', label: 'ขั้นตอนการเช่า' },
    { id: 'faq', label: 'คำถามที่พบบ่อย' }
  ];

  return (
    <nav className="fixed w-full top-0 z-50 bg-white shadow-md transition-all duration-500">
      <div className="mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="text-purple-600 text-xl font-bold">
            Dormitory
          </div>

          <div className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-gray-600 hover:text-gray-800 transition-colors font-bold"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`text-gray-600 hover:text-gray-800 focus:outline-none transform transition-transform duration-300 ${isOpen ? 'rotate-90' : 'rotate-0'}`}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden">
            <div  data-aos="fade-right" className="px-2 pt-2 pb-3 space-y-1 bg-white">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full text-left px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md font-bold"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}