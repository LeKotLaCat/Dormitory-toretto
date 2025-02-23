import React from 'react';

export default function Navbar() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <nav className="flex justify-between items-center p-4 shadow-md bg-white font-bold fixed w-full transition-all top-0 z-50">
      <div className="text-purple-600 text-xl">
        Dormitory
      </div>
      <div className="flex space-x-6">
        <button onClick={() => scrollToSection('home')} className="text-gray-600 hover:text-gray-800 transition-colors">
          หน้าแรก
        </button>
        <button onClick={() => scrollToSection('products')} className="text-gray-600 hover:text-gray-800 transition-colors">
          บริการของเรา
        </button>
        <button onClick={() => scrollToSection('dorm-type')} className="text-gray-600 hover:text-gray-800 transition-colors">
          ประเภทห้องพัก
        </button>
        <button onClick={() => scrollToSection('step')} className="text-gray-600 hover:text-gray-800 transition-colors">
          ขั้นตอนการเช่า
        </button>
        <button onClick={() => scrollToSection('faq')} className="text-gray-600 hover:text-gray-800 transition-colors">
          คำถามที่พบบ่อย
        </button>
      </div>
    </nav>
  );
}