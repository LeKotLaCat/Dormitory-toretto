"use client"

import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  Users, 
  Home, 
  PhoneCall, 
  Users2,
  Settings, 
  Calendar, 
  DollarSign,
  User,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import SidebarUser from '@/components/SidebarUser';
import Footer from '@/components/Footer';

const UserMain = () => {
  const [userProfile, setUserProfile] = useState({
    name: "",
    studentId: "",
    roomNumber: "",
    roomType: "",
    email: "",
    phone: "",
    checkInDate: "",
    nextPaymentDue: "",
    profileImage: "/profile/default-profile.jpg"
  });

  const [stats, setStats] = useState({
    totalStudents: 248,
    occupancyRate: 87,
    pendingRequests: 12,
    maintenanceTickets: 8
  });

  const features = [
    { 
      id: 1, 
      title: 'จ่ายค่าเช่า', 
      description: 'ตรวจสอบค่าห้อง ค่าน้ำ ค่าไฟของเดือนปัจจุบัน', 
      icon: <CreditCard className="h-8 w-8 text-blue-500" />,
      path: '/user/bill',
      color: 'bg-blue-50 hover:bg-blue-100'
    },
    { 
      id: 2, 
      title: 'ใช้บริการแม่บ้าน', 
      description: 'นัดหมายให้แม่บ้านเข้ามาทำความสะอาดห้อง', 
      icon: <PhoneCall className="h-8 w-8 text-green-500" />,
      path: '/user/service',
      color: 'bg-green-50 hover:bg-green-100'
    },
    { 
      id: 3, 
      title: 'ประวัติการทำธุรกรรม', 
      description: 'ดูประวัติการชำระเงินย้อนหลัง', 
      icon: <Clock className="h-8 w-8 text-purple-500" />,
      path: '/user/transaction',
      color: 'bg-purple-50 hover:bg-purple-100'
    },
    { 
      id: 5, 
      title: 'บอร์ดสนทนา', 
      description: 'พูดคุยและแชร์ข้อมูลกับผู้เช่าคนอื่นๆ', 
      icon: <Users2 className="h-8 w-8 text-red-500" />,
      path: '/user/chat',
      color: 'bg-red-50 hover:bg-red-100'
    },
  ];

  const currentHour = new Date().getHours();
  let greeting = "";
  if (currentHour < 12) {
    greeting = "สวัสดีตอนเช้า";
  } else if (currentHour < 17) {
    greeting = "สวัสดีตอนบ่าย";
  } else {
    greeting = "สวัสดีตอนเย็น";
  }

  const nextPayment = new Date("2025-04-15"); 
  const [daysUntilPayment, setDaysUntilPayment] = useState(0); 

  const notifications = [
    { id: 1, message: "แม่บ้านจะเข้าทำความสะอาดในวันพรุ่งนี้ เวลา 10:00 น.", time: "1 ชั่วโมงที่แล้ว" },
    { id: 2, message: "ค่าใช้จ่ายประจำเดือนมีนาคมพร้อมให้ชำระแล้ว", time: "1 วันที่แล้ว" },
    { id: 3, message: "มีประกาศบำรุงระบบน้ำในวันที่ 5 เม.ย. เวลา 13:00-16:00", time: "2 วันที่แล้ว" }
  ];


  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('http://localhost:3000/auth/profile', { 
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },credentials: 'include',

        });

        if (!response.ok) {
          console.error("Failed to fetch user profile:", response.status);
          return;
        }

        const data = await response.json();
        console.log("Fetched user data:", data);

        setUserProfile(prevProfile => ({
            ...prevProfile,
            name: `${data.firstname} ${data.lastname}`,
            email: data.email,
            phone: data.telephone,
            profileImage: data.userImg || "/profile/default-profile.jpg",
            roomNumber : data.roomName,
            roomType : data.roomTypeId
        }));
        
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
      fetchUserProfile();

     // Calculate days until next payment (inside useEffect so it updates)
    const today = new Date();
    setDaysUntilPayment(Math.ceil((nextPayment.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

  }, []); // Empty dependency array means this effect runs once on mount


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex flex-1">
        <SidebarUser />
        
        <main className="flex-1 p-6 pt-16 md:pt-6 overflow-auto">
          <div className="container mx-auto">
            {/* Welcome Section with User Profile */}
            <div className="mb-8 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="relative w-24 h-24 md:w-32 md:h-32 overflow-hidden rounded-full border-4 border-primary/20">
                  <Image 
                    src={userProfile.profileImage} 
                    alt={userProfile.name}
                    fill
                    className="object-cover"
                  />
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">{greeting}, {userProfile.name.split(' ')[0]}</h2>
                      <p className="text-gray-600 mb-3">รหัสนักศึกษา: {userProfile.studentId}</p> {/* Update here */}
                    </div>
                    
                    <Link href="/user/profile" className="inline-flex items-center mt-2 md:mt-0 px-4 py-2 text-sm bg-primary/10 text-primary hover:bg-primary/20 rounded-md transition-colors">
                      <Settings className="w-4 h-4 mr-2" />
                      แก้ไขโปรไฟล์
                    </Link>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="flex items-center gap-2">
                      <Home className="text-primary w-5 h-5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">ห้องพัก</p>
                        <p className="font-medium">{userProfile.roomNumber} Type : {userProfile.roomType}</p>  {/* Update here */}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Phone className="text-primary w-5 h-5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">โทรศัพท์</p>
                        <p className="font-medium">{userProfile.phone}</p> {/* Update here */}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Mail className="text-primary w-5 h-5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">อีเมล</p>
                        <p className="font-medium truncate">{userProfile.email}</p> {/* Update here */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Payment Reminder */}
            <div className="mb-8 bg-amber-50 border border-amber-200 rounded-lg p-6 flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <AlertTriangle className="w-10 h-10 text-amber-500 mr-4" />
                <div>
                  <h3 className="font-semibold text-lg text-amber-800">กำหนดชำระเงินครั้งถัดไป</h3>
                  <p className="text-amber-700">ค่าเช่าประจำเดือนเมษายน ภายในวันที่ {userProfile.nextPaymentDue}</p>
                </div>
              </div>
              <div>
                <Link href="/user/bill">
                  <button className="inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors">
                    <DollarSign className="w-4 h-4 mr-2" />
                    ชำระเงินตอนนี้
                  </button>
                </Link>
              </div>
            </div>

            {/* Feature Buttons */}
            <h2 className="text-xl font-semibold text-gray-800 mb-4">บริการหอพัก</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {features.map((feature) => (
                <Link href={feature.path} key={feature.id}>
                  <div className={`p-6 rounded-lg shadow-sm border border-gray-200 ${feature.color} transition-all duration-200 hover:scale-105 h-full`}>
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-4">
                        {feature.icon}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            {/* Recent Notifications */}
            <h2 className="text-xl font-semibold text-gray-800 mb-4">การแจ้งเตือนล่าสุด</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8 overflow-hidden">
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div key={notification.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between">
                      <p className="text-gray-800">{notification.message}</p>
                      <span className="text-sm text-gray-500">{notification.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-gray-50 p-3 text-center border-t border-gray-100">
                <Link href="/user/notifications" className="text-primary hover:text-primary-dark text-sm">
                  ดูการแจ้งเตือนทั้งหมด
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default UserMain;