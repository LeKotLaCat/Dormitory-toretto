import Image from "next/image";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-purple-50">
      {/* Navigation */}
      <Navbar />
      {/* Main Content */}
      <main className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between mt-12">
        {/* Left Content */}
        <div className="md:w-1/2 space-y-6">
          <h1 className="bg-gradient-to-r text-transparent bg-clip-text w-fit from-blue-500 to-[#0000ff] text-4xl md:text-5xl lg:text-6xl font-bold">ยินดีต้อนรับ</h1>
          <div className="space-y-2 text-4xl md:text-5xl lg:text-6xl font-bold">
            <h2>สู่ระบบ</h2>
            <h3>การจัดการหอพัก</h3>
          </div>
          
          <p className="text-gray-600 mt-4">เป็นระบบออนไลน์ที่ใช้เพื่อดูแลและจัดการ &quotธุรกิจหอพัก&quot ช่วยประหยัดเวลา</p>  
          
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-center">
              <span className="text-purple-600 mr-2">✓</span>
              ระบบช่วยจัดการข้อมูลลูกค้า ห้องพัก
            </li>
            <li className="flex items-center">
              <span className="text-purple-600 mr-2">✓</span>
              ระบบช่วยในการบันทึกค่าน้ำ ค่าไฟและค่าเช่าห้อง
            </li>
            <li className="flex items-center">
              <span className="text-purple-600 mr-2">✓</span>
              ระบบจัดการห้องผู้เช่าภายใน
            </li>
          </ul>

          <div className="flex space-x-4 mt-8">
            <button className="bg-purple-500 text-white px-6 py-2 rounded-md hover:bg-purple-600">
              เข้าสู่ระบบ
            </button>
            <button className="border border-purple-500 text-purple-500 px-6 py-2 rounded-md hover:bg-purple-50">
              สมัครสมาชิก
            </button>
          </div>
        </div>

        {/* Right Content - Image */}
        <div className="md:w-1/2 mt-8 md:mt-0">
          <div className="rounded-full overflow-hidden bg-purple-100 p-8">
            <Image 
              src="globe.svg"
              width={24}
              height={24}
              alt="Dormitory illustration"
              className="w-full h-auto"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
