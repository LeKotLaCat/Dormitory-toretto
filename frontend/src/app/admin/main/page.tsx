"use client";

import React, { useState } from "react";
import {
  Eye,
  Users,
  Home,
  FileText,
  Bell,
  Settings,
  Calendar,
  DollarSign,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";

const AdminMain = () => {
  const [stats, setStats] = useState({
    totalStudents: 248,
    occupancyRate: 87,
    pendingRequests: 12,
    maintenanceTickets: 8,
  });

  const features = [
    {
      id: 1,
      title: "แก้ไขผู้เช่า",
      description: "ดูและแก้ไขจัดการ การเข้าพัก",
      icon: <Users className="h-8 w-8 text-blue-500" />,
      path: "/admin/tenant",
      color: "bg-blue-50 hover:bg-blue-100",
    },
    {
      id: 2,
      title: "แก้ไขห้องพัก",
      description: "จัดการรายละเอียดหอพัก",
      icon: <Home className="h-8 w-8 text-green-500" />,
      path: "/admin/room",
      color: "bg-green-50 hover:bg-green-100",
    },
    {
      id: 3,
      title: "บันทึกค่าสาธารณูปโภค",
      description: "ดุแลค่าสาธารณูประโภคผู้เข้าพัก",
      icon: <DollarSign className="h-8 w-8 text-purple-500" />,
      path: "/admin/utility ",
      color: "bg-purple-50 hover:bg-purple-100",
    },
    {
      id: 4,
      title: "จัดการผู้ใช้งาน",
      description: "จัดการรหัสผู้เช่าห้องพัก",
      icon: <Settings className="h-8 w-8 text-orange-500" />,
      path: "/admin/user",
      color: "bg-orange-50 hover:bg-orange-100",
    },
    {
      id: 5,
      title: "คิวเข้าดูหอพัก",
      description: "จรวจสอบและจัดการคิว",
      icon: <Bell className="h-8 w-8 text-red-500" />,
      path: "/admin/queue",
      color: "bg-red-50 hover:bg-red-100",
    },
    {
      id: 6,
      title: "ดูคิวแม่บ้าน",
      description: "ดูแลความเรียบร้อยของคิวแม่บ้าน",
      icon: <FileText className="h-8 w-8 text-indigo-500" />,
      path: "/admin/cleaning",
      color: "bg-indigo-50 hover:bg-indigo-100",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col ">
      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 pt-16 md:pt-6 overflow-auto">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-800">แดชบอร์ด</h1>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      ผู้เช่าทั้งหมด
                    </p>
                    <p className="text-2xl font-bold text-gray-800">
                      {stats.totalStudents}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      ห้องพักทั้งหมด
                    </p>
                    <p className="text-2xl font-bold text-gray-800">
                      {stats.occupancyRate}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <Home className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      รอการยืนยันเข้าพัก
                    </p>
                    <p className="text-2xl font-bold text-gray-800">
                      {stats.pendingRequests}
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <FileText className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between ">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      บิลค้างชำระ
                    </p>
                    <p className="text-2xl font-bold text-gray-800">
                      {stats.maintenanceTickets}
                    </p>
                  </div>
                  <div className="p-3 bg-red-100 rounded-full">
                    <Settings className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Buttons */}
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              เครื่องมือด่วน
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {features.map((feature) => (
                <Link href={feature.path} key={feature.id}>
                  <div
                    className={`p-6 rounded-lg shadow-sm border border-gray-200 ${feature.color} transition-all duration-200 hover:scale-105 h-full`}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-4">{feature.icon}</div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default AdminMain;
