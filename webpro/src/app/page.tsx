"use client"

import Image from "next/image";
import Navbar from "@/components/Navbar";
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-purple-50">
      {/* Navigation */}
      <Navbar />
      {/* Main Content */}
      <main className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between mt-12">
        {/* Left Content */}
        <div className="md:w-1/2 space-y-6">
          <div className="space-y-2 text-4xl md:text-5xl lg:text-6xl font-bold">
            <h1 className="bg-gradient-to-r text-transparent bg-clip-text w-fit from-blue-500 to-primary text-4xl md:text-5xl lg:text-6xl font-bold">
              ยินดีต้อนรับ
            </h1>
            <h2>สู่ระบบ</h2>
            <h3>การจัดการหอพัก</h3>
          </div>

          <p className="text-gray-600 mt-4">
            เป็นระบบออนไลน์ที่ใช้เพื่อดูแลและจัดการ &quot;ธุรกิจหอพัก&quot;
            ช่วยประหยัดเวลา
          </p>

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
            <button className="bg-purple-500 text-white px-6 py-2 rounded-md hover:bg-purple-600" onClick={() => router.push('/login')}>
              เข้าสู่ระบบ
            </button>
            <button className="border border-purple-500 text-purple-500 px-6 py-2 rounded-md hover:bg-purple-50" onClick={() => router.push('/register')}>
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

      <div
        id="products"
        className="flex justify-center pt-24 lg:pt-32 px-6 2xl:px-0"
      >
        <div className="w-[1280px]">
          <div className="text-center mb-12 mb:mb-16">
            <h1 className="text-3xl md:text-4xl font-semibold">Our Services</h1>
            <p className="text-lg md:text-xl">บริการของเรา</p>
          </div>

          <div className="flex justify-between p-6 border-2 border-primary rounded-2xl bg-gradient-to-br from-primary/20 via-primary/0 mb-12">
            <div>
              <div className="w-[80px] h-[80px] rounded-xl bg-primary flex justify-center items-center -mt-12 mb-6">
                <h1 className="text-3xl">
                  <i className="fal fa-globe"></i>
                </h1>
              </div>
              <h1 className="text-3xl md:text-4xl font-semibold mb-2">
                จัดทำระบบเว็บไซต์
              </h1>
              <p className="w-full md:w-[600px] mb-6">
                บริการจัดทำระบบเว็บไซต์ของเราให้คำปรึกษาอย่างเป็นกันเอง
                แม้คุณจะไม่มีความรู้ด้านระบบเว็บไซต์
                ทีมงานของเราพร้อมช่วยเหลือทุกขั้นตอนด้วยความจริงใจ
                พัฒนาระบบด้วยเทคโนโลยีที่ทันสมัย
                ปรับปรุงโครงสร้างระบบให้ทำงานได้อย่างมีประสิทธิภาพสูงสุด
                ทำให้เว็บไซต์ของคุณมีความทันสมัย ใช้งานง่าย
                และตอบโจทย์ทุกความต้องการของธุรกิจ
              </p>
              <div className="flex flex-wrap gap-3">
                <a className="bg-primary px-4 py-1 rounded-lg text-base md:text-lg font-medium text-white">
                  ราคาเริ่มต้นที่ 20,000 บาท
                </a>
              </div>
            </div>
            <div className="w-full hidden xl:flex justify-center items-center">
              <Image
                width={150}
                height={24}
                className="w-[150px] z-10 translate-x-6 translate-y-6 drop-shadow-xl rounded-lg"
                src="https://cdn.aona.co.th/1htshc8ib/ezdn.png"
                alt="ezdn"
              />
              <Image
                width={300}
                height={24}
                className="w-[300px] z-0 drop-shadow-xl rounded-lg"
                src="https://cdn.aona.co.th/1htsgj8io/image 9.jpg"
                alt="ophtus_store"
              />
              <Image
                width={200}
                height={24}
                className="w-[200px] z-10 -translate-x-6 -translate-y-2 drop-shadow-xl rounded-lg"
                src="https://cdn.aona.co.th/1htshc8ib/bloxcode.png"
                alt="bloxcodeth"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-8 mb-8">
            <div className="p-6 border border-red-500 bg-gradient-to-br from-red-500/20 via-red-500/0 rounded-2xl">
              <div className="-mt-12 w-[60px] h-[60px] flex justify-center items-center rounded-lg bg-red-500 mb-4">
                <h1 className="text-xl">
                  <i className="far fa-object-group"></i>
                </h1>
              </div>
              <h1 className="text-xl md:text-2xl font-semibold mb-2">
                ออกแบบหน้าตาเว็บไซต์ (UI/UX)
              </h1>
              <p className="text-sm md:text-base mb-4">
                บริการออกแบบหน้าตาเว็บไซต์ (UI/UX)
                ของเรามุ่งเน้นการสร้างสรรค์ดีไซน์ที่แปลกใหม่และไม่ซ้ำใคร
                เพื่อให้เว็บไซต์ของคุณโดดเด่นและมีเอกลักษณ์
                ทีมงานของเราพร้อมสร้างประสบการณ์การใช้งานที่น่าประทับใจและตอบโจทย์ทุกความต้องการ
              </p>
              <div className="flex flex-wrap gap-2">
                <a className="w-fit bg-red-500 px-4 py-1 rounded-lg text-sm md:text-base font-medium text-white">
                  ราคาเริ่มต้นที่ 1,500 บาท
                </a>
              </div>
            </div>
            <div className="p-6 border border-red-500 bg-gradient-to-br from-red-500/20 via-red-500/0 rounded-2xl">
              <div className="-mt-12 w-[60px] h-[60px] flex justify-center items-center rounded-lg bg-red-500 mb-4">
                <h1 className="text-xl">
                  <i className="far fa-pen"></i>
                </h1>
              </div>
              <h1 className="text-xl md:text-2xl font-semibold mb-2">
                แก้ไขระบบเว็บไซต์
              </h1>
              <p className="text-sm md:text-base mb-4">
                บริการแก้ไขระบบเว็บไซต์ของเรามุ่งเน้นการซ่อมแซมและปรับปรุงระบบเว็บไซต์ที่มีอยู่แล้ว
                ไม่ว่าจะเป็นระบบที่เราจัดทำหรือไม่
                ทีมงานผู้เชี่ยวชาญพร้อมให้คำปรึกษาและแก้ไขปัญหาอย่างรวดเร็ว
                เพื่อให้เว็บไซต์ของคุณกลับมาใช้งานได้อย่างมีประสิทธิภาพสูงสุด
              </p>
              <div className="flex flex-wrap gap-2">
                <a className="w-fit bg-red-500 px-4 py-1 rounded-lg text-sm md:text-base font-medium text-white">
                  ราคาเริ่มต้นที่ 500 บาท
                </a>
                <a
                  href="https://m.me/aona.co.th"
                  target="_blank"
                  className="w-fit border border-white px-4 py-1 rounded-lg text-sm md:text-base transition duration-300 hover:bg-white hover:text-black"
                >
                  <i className="far fa-comment-dots"></i> ติดต่อสั่งทำ
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div>
        <h1>จัดการสะดวก ง่ายแค่ปลายนิ้ว</h1>
      </div> */}
    </div>
  );
}
