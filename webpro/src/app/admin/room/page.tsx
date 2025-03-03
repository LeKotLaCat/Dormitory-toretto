"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  Home,
  User,
  Edit,
  Trash2,
  Phone,
  Mail,
  Key,
  CalendarRange,
  AlertTriangle,
  Info,
  UserPlus,
  X,
  Check,
  BedDouble,
  ImagePlus
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Room type definition
type RoomType = {
  id: number;
  roomNumber: string;
  roomType: string;
  occupied: boolean;
  details: string;
  imageSrc: string;
};

// Sample room types
const roomTypeOptions = ["Type A", "Type B", "Type C", "ปรับอากาศหญิงล้วน", "ไม่ปรับอากาศชายล้วน", "ไม่ปรับอากาศชาย-หญิง"];

// Sample room data
const sampleRooms: RoomType[] = [
  {
    id: 1,
    roomNumber: '401',
    roomType: 'Type A',
    occupied: true,
    details: 'ห้องพัดลมสำหรับ 2 คน พร้อมห้องน้ำในตัว',
    imageSrc: 'https://www.it.kmitl.ac.th/wp-content/themes/itkmitl2017wp/img/life/life-13.jpg',
  },
  {
    id: 2,
    roomNumber: '402',
    roomType: 'Type A',
    occupied: false,
    details: 'ห้องพัดลมสำหรับ 2 คน พร้อมห้องน้ำในตัว',
    imageSrc: 'https://www.it.kmitl.ac.th/wp-content/themes/itkmitl2017wp/img/life/life-13.jpg',
  },
  {
    id: 3,
    roomNumber: '305',
    roomType: 'Type B',
    occupied: true,
    details: 'ห้องปรับอากาศสำหรับ 2 คน พร้อมห้องน้ำในตัว',
    imageSrc: 'https://www.it.kmitl.ac.th/wp-content/themes/itkmitl2017wp/img/life/life-13.jpg',
  },
  {
    id: 4,
    roomNumber: '206',
    roomType: 'Type C',
    occupied: false,
    details: 'ห้องปรับอากาศสำหรับ 1 คน พร้อมห้องน้ำในตัว',
    imageSrc: 'https://www.it.kmitl.ac.th/wp-content/themes/itkmitl2017wp/img/life/life-13.jpg',
  },
  {
    id: 5,
    roomNumber: '502',
    roomType: 'ปรับอากาศหญิงล้วน',
    occupied: true,
    details: 'ห้องปรับอากาศสำหรับนักศึกษาหญิง 1 คน พร้อมห้องน้ำในตัว',
    imageSrc: 'https://www.it.kmitl.ac.th/wp-content/themes/itkmitl2017wp/img/life/life-13.jpg',
  },
  {
    id: 6,
    roomNumber: '103',
    roomType: 'ไม่ปรับอากาศชายล้วน',
    occupied: false,
    details: 'ห้องพัดลมสำหรับนักศึกษาชาย 2 คน พร้อมห้องน้ำรวม',
    imageSrc: 'https://www.it.kmitl.ac.th/wp-content/themes/itkmitl2017wp/img/life/life-13.jpg',
  },
];

const RoomManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [rooms, setRooms] = useState<RoomType[]>(sampleRooms);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomType | null>(null);
  const [editFormData, setEditFormData] = useState<RoomType | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Filter rooms based on search term
  const filteredRooms = rooms.filter(room => 
    room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.roomType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle edit button click
  const handleEditClick = (room: RoomType) => {
    setSelectedRoom(room);
    setEditFormData({...room});
    setImagePreview(room.imageSrc);
    setIsEditDialogOpen(true);
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (editFormData) {
      setEditFormData({
        ...editFormData,
        [name]: value
      });
    }
  };

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // Submit edit form
  const handleEditSubmit = () => {
    if (editFormData) {
      // In a real application, you would upload the image to a server here
      // and get back a URL to store in the database
      
      // For now, we'll just use the preview URL if an image was selected
      const updatedRoom = {
        ...editFormData,
        imageSrc: imagePreview || editFormData.imageSrc
      };
      
      setRooms(rooms.map(room => 
        room.id === editFormData.id ? updatedRoom : room
      ));
      
      setIsEditDialogOpen(false);
      
      // Clean up preview URL to avoid memory leaks
      if (imagePreview && imagePreview !== editFormData.imageSrc) {
        URL.revokeObjectURL(imagePreview);
      }
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col overflow-auto'>
      <div className='flex flex-1'>
        <Sidebar />
        
        <main className='h-screen flex-1 overflow-auto'>
          <div className="p-6 pt-16 md:pt-6">
            <div className="container mx-auto">
              <div className='flex flex-col md:flex-row md:items-center justify-between mb-6'>
                <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-0">จัดการห้องพัก</h1>
                <div className='relative w-full md:w-64'>
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="text"
                    placeholder='ค้นหาห้องพัก...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='pl-9 w-full'
                  />
                </div>
              </div>
              
              {/* Room Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRooms.map((room) => (
                  <Card key={room.id} className="overflow-hidden hover:shadow-md transition-shadow duration-300">
                    <div className="relative w-full h-48">
                      <Image
                        src={room.imageSrc}
                        alt={`Room ${room.roomNumber}`}
                        className="object-cover"
                        fill
                      />
                      <Badge 
                        className={`absolute top-2 right-2 ${
                          room.occupied 
                            ? "bg-red-100 text-red-800 border-red-200" 
                            : "bg-green-100 text-green-800 border-green-200"
                        }`}
                      >
                        {room.occupied ? "ไม่ว่าง" : "ว่าง"}
                      </Badge>
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-xl">ห้อง {room.roomNumber}</CardTitle>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {room.roomType}
                        </Badge>
                      </div>
                      <CardDescription className="line-clamp-2 mt-1">
                        {room.details}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="pt-0">
                      <Button 
                        variant="outline" 
                        className="w-full flex items-center justify-center gap-2"
                        onClick={() => handleEditClick(room)}
                      >
                        <Edit className="h-4 w-4" />
                        แก้ไขข้อมูลห้อง
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {filteredRooms.length === 0 && (
                <div className="bg-white rounded-lg shadow p-8 text-center mt-6">
                  <p className="text-gray-500">ไม่พบข้อมูลห้องพัก</p>
                </div>
              )}
            </div>
          </div>
          
          <Footer />
        </main>
      </div>

      {/* Edit Room Dialog */}
      {editFormData && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>แก้ไขข้อมูลห้องพัก</DialogTitle>
              <DialogDescription>
                แก้ไขข้อมูลห้องพักและอัพโหลดรูปภาพห้องพัก
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="roomNumber" className="text-right">
                  เลขห้อง
                </Label>
                <Input
                  id="roomNumber"
                  name="roomNumber"
                  value={editFormData.roomNumber}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="roomType" className="text-right">
                  ประเภทห้อง
                </Label>
                <select
                  id="roomType"
                  name="roomType"
                  value={editFormData.roomType}
                  onChange={handleInputChange}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {roomTypeOptions.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="occupied" className="text-right">
                  สถานะห้อง
                </Label>
                <select
                  id="occupied"
                  name="occupied"
                  value={editFormData.occupied.toString()}
                  onChange={(e) => {
                    handleInputChange({
                      ...e,
                      target: {
                        ...e.target,
                        name: 'occupied',
                        value: e.target.value === 'true'
                      }
                    } as any)
                  }}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="false">ว่าง</option>
                  <option value="true">ไม่ว่าง</option>
                </select>
              </div>
              
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="details" className="text-right pt-2">
                  รายละเอียด
                </Label>
                <Textarea
                  id="details"
                  name="details"
                  value={editFormData.details}
                  onChange={handleInputChange}
                  className="col-span-3 min-h-[100px]"
                  placeholder="รายละเอียดห้องพัก"
                />
              </div>
              
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="roomImage" className="text-right pt-2">
                  รูปภาพห้องพัก
                </Label>
                <div className="col-span-3 space-y-3">
                  {imagePreview && (
                    <div className="relative w-full h-48 rounded-md overflow-hidden border border-gray-200">
                      <Image
                        src={imagePreview}
                        alt="Room preview"
                        className="object-cover"
                        fill
                      />
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Input
                      id="roomImage"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <Label
                      htmlFor="roomImage"
                      className="flex cursor-pointer items-center gap-2 rounded-md bg-primary/10 px-4 py-2 text-primary hover:bg-primary/20 transition-colors"
                    >
                      <ImagePlus className="h-4 w-4" />
                      เลือกรูปภาพ
                    </Label>
                    {imageFile && (
                      <span className="text-sm text-gray-500 truncate max-w-[180px]">
                        {imageFile.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter className="sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditDialogOpen(false);
                  if (imagePreview && imagePreview !== editFormData.imageSrc) {
                    URL.revokeObjectURL(imagePreview);
                  }
                }}
              >
                <X className="mr-2 h-4 w-4" />
                ยกเลิก
              </Button>
              <Button
                type="button"
                onClick={handleEditSubmit}
                className="bg-green-600 hover:bg-green-700"
              >
                <Check className="mr-2 h-4 w-4" />
                บันทึกข้อมูล
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default RoomManagementPage;