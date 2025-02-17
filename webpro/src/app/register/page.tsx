"use client"

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left section */}
      <div className="w-1/2 bg-white p-8 flex items-center justify-center">
        <div className="text-4xl font-bold">
          <span className="text-blue-600">Dormitory</span>
          <span className="text-gray-800">Manager</span>
        </div>
      </div>

      {/* Right section */}
      <div className="w-1/2 bg-gray-50 p-8 flex flex-col justify-center">
        <div className="max-w-md w-full mx-auto space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-blue-600 mb-2">Register</h2>
            <p className="text-gray-600">มาเริ่มต้นสัมผัสประสบการณ์ใหม่ไปกับเราเลย</p>
            <p className="text-gray-600 text-sm">
              หรือมีบัญชีอยู่แล้ว? <a href="#" className="text-blue-600 hover:underline">เข้าสู่ระบบ</a>
            </p>
          </div>

          <div className="space-y-4">

            <div className="relative">
              <input
                type="text"
                placeholder="Username / ชื่อผู้ใช้"
                className="w-full p-3 border border-gray-300 rounded-lg bg-white"
              />
            </div>

            <div className="relative">
              <input
                type="email"
                placeholder="Email / อีเมล"
                className="w-full p-3 border border-gray-300 rounded-lg bg-white"
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password / รหัสผ่าน"
                className="w-full p-3 border border-gray-300 rounded-lg bg-white pr-10"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm password / ยืนยันรหัสผ่าน"
                className="w-full p-3 border border-gray-300 rounded-lg bg-white pr-10"
              />
              <button
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="terms" className="rounded border-gray-300" />
              <label htmlFor="terms" className="text-sm text-gray-600">
                ฉันได้อ่านและยอมรับเงื่อนไขการใช้งานตาม{" "}
                <a href="#" className="text-blue-600 hover:underline">ข้อกำหนดการใช้บริการ</a>{" "}
                และ{" "}
                <a href="#" className="text-blue-600 hover:underline">ความเป็นส่วนตัว</a>
              </label>
            </div>

            <button className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 font-medium">
              สร้างบัญชี
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;