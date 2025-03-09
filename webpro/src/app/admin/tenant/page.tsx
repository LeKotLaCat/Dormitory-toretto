"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import { 
  Card, 
  CardContent,
  CardFooter,
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Info
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
import { format } from 'date-fns';

import { TenantData, initialRooms } from '@/components/data';

const TenantsPage = () => {
  const [rooms, setRooms] = useState(initialRooms);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [editingTenant, setEditingTenant] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [tenantDetails, setTenantDetails] = useState<any>(null);
  const [inputUserId, setInputUserId] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // "all", "occupied", "vacant"
  
  // Set user details when editing
  useEffect(() => {
    if (selectedRoom && !editingTenant) {
      const room = rooms.find(r => r.roomNumber === selectedRoom);
      if (room && room.tenantId) {
        const tenant = TenantData.find(u => u.id === room.tenantId);
        if (tenant) {
          setTenantDetails(tenant);
          setInputUserId(tenant.id);
        }
      } else {
        setTenantDetails(null);
        setInputUserId("");
      }
    }
  }, [selectedRoom, editingTenant, rooms]);

  // Check screen size on mount and resize

  // Filter rooms based on search term
  const filteredRooms = rooms.filter(room => {
    const matchesSearch = (
      room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (room.tenantId && TenantData.find(u => u.id === room.tenantId)?.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    return matchesSearch;
  });

  const handleOpenRoomDetails = (roomNumber: string) => {
    setSelectedRoom(roomNumber);
    setEditingTenant(false);
    setIsUserDialogOpen(true);
  };

  const handleEditTenant = () => {
    setEditingTenant(true);
  };

  const handleSaveTenantChanges = () => {
    const room = rooms.find(r => r.roomNumber === selectedRoom);
    if (room) {
      // Check if inputUserId is valid or empty
      if (inputUserId === "" || inputUserId === "unassigned") {
        // Set room to vacant
        setRooms(rooms.map(r => 
          r.roomNumber === selectedRoom ? { ...r, status: "vacant", tenantId: null } : r
        ));
      } else {
        // Check if user exists
        const user = TenantData.find(u => u.id === inputUserId);
        if (user) {
          // Update room with new tenant
          setRooms(rooms.map(r => 
            r.roomNumber === selectedRoom ? { ...r, status: "occupied", tenantId: inputUserId } : r
          ));
          setTenantDetails(user);
        } else {
          alert("User ID not found");
          return;
        }
      }
    }
    setEditingTenant(false);
  };

  const handleDeleteTenant = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteTenant = () => {
    setRooms(rooms.map(r => 
      r.roomNumber === selectedRoom ? { ...r, status: "vacant", tenantId: null } : r
    ));
    setIsDeleteDialogOpen(false);
    setIsUserDialogOpen(false);
  };

  const cancelDeleteTenant = () => {
    setIsDeleteDialogOpen(false);
  };
  
  const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputUserId(e.target.value);
  };

  const roomsByFloor = filteredRooms.reduce((acc, room) => {
    const floorNum = Math.floor(parseInt(room.roomNumber) / 100);
    if (!acc[floorNum]) acc[floorNum] = [];
    acc[floorNum].push(room);
    return acc;
  }, {} as Record<number, typeof filteredRooms>);

  const sortedFloors = Object.keys(roomsByFloor)
  .map(Number)
  .sort((a, b) => b - a);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col overflow-auto">
      <div className="flex flex-1">
        <Sidebar />
        <main className="h-screen flex-1 overflow-auto">
          <div className="p-6 pt-16 md:pt-6">
            <div className="container mx-auto">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-0">แก้ไขข้อมูลผู้เช่า</h1>
                <div className="flex gap-3">
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      type="text"
                      placeholder="ค้นหาห้องหรือผู้เช่า..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 w-full"
                    />
                  </div>
                </div>
              </div>

              {filteredRooms.length === 0 ? (
                <div className="bg-white rounded-md p-8 text-center">
                  <p className="text-gray-500">ไม่มีห้องที่ตรงการค้นหา</p>
                </div>
              ) : (
                sortedFloors// Sort floors in descending order
                .map(floor => (
                  <div key={floor} className="mb-12">
                    <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-3 flex items-center">
                      ชั้น {floor}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {roomsByFloor[floor].map((room) => (
                        <Card 
                          key={room.roomNumber} 
                          className={`hover:shadow-md transition-all duration-200 cursor-pointer ${
                            room.status === "vacant" ? "bg-gray-50" : ""
                          }`}
                          onClick={() => handleOpenRoomDetails(room.roomNumber)}
                        >
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-2">
                                <Home className="h-5 w-5 text-primary" />
                                <CardTitle>ห้อง {room.roomNumber}</CardTitle>
                              </div>
                              <Badge 
                                variant="outline" 
                                className={`${
                                  room.status === "occupied" 
                                  ? "bg-green-50 text-green-700 border-green-200" 
                                  : "bg-gray-50 text-gray-700 border-gray-200"
                                }`}
                              >
                                {room.status === "occupied" ? "ไม่ว่าง" : "ว่าง"}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div className="text-sm text-gray-500">
                                {room.type} • ฿{room.monthlyRent.toLocaleString()} / เดือน
                              </div>
                              {room.tenantId ? (
                                <div className="flex items-center gap-2 mt-2">
                                  <User className="h-4 w-4 text-gray-500" />
                                  <span className="font-medium">
                                    {TenantData.find(u => u.id === room.tenantId)?.name}
                                  </span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 mt-2 text-gray-500 italic">
                                  <User className="h-4 w-4 text-gray-400" />
                                  <span>ไม่มีผู้เช่า</span>
                                </div>
                              )}
                            </div>
                          </CardContent>
                          <CardFooter className="pt-0">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 ml-auto"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenRoomDetails(room.roomNumber);
                              }}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              แก้ไข
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>

      <Footer />

      {/* Tenant Details/Edit Dialog */}
      <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedRoom && `ห้อง ${selectedRoom} - ${rooms.find(r => r.roomNumber === selectedRoom)?.type}`}
            </DialogTitle>
            <DialogDescription>
              {editingTenant ? "แก้ไขข้อมูลผู้เช่า" : "ข้อมูลผู้เช่า"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Room is vacant */}
            {selectedRoom && rooms.find(r => r.roomNumber === selectedRoom)?.status === "vacant" && !editingTenant && (
              <div className="rounded-md bg-gray-50 p-4 flex items-center gap-3">
                <Home className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-800">ห้องนี้ว่าง</p>
                  <p className="text-sm text-gray-600">
                    สามารถเพิ่มผู้เช่าได้ด้วยการกดปุ่ม "แก้ไขผู้เช่า" ข้างล่างนี้
                  </p>
                </div>
              </div>
            )}

            {/* Editing mode */}
            {editingTenant && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="userSelect">เลือกผู้ใช้</Label>
                  <Select 
                    value={inputUserId} 
                    onValueChange={setInputUserId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="-- เลือกผู้ใข้ --" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">-- ไม่มีผู้เช่า (ว่าง) --</SelectItem>
                      {TenantData.map(user => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name} ({user.id})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="relative flex items-center my-4">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className="flex-shrink mx-4 text-gray-400 text-sm">หรือ</span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="userId">ใส่ข้อมูลผู้เช้าโดยตรง</Label>
                  <Input 
                    id="userId" 
                    value={inputUserId} 
                    onChange={handleUserIdChange} 
                    placeholder="ใส่ไอดีผู้ใช้ (ปล่อยว่างถ้าไม่มีผู้เช่า)"
                  />
                  <div className="flex items-start gap-2 mt-1.5">
                    <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <p className="text-[12.5px] text-gray-500">
                      กรอกไอดีของผู้เช่า (เช่น U001) เพื่อระบุผู้เช่า, หรือปล่อยว่างไว้ถ้าไม่มีผู้เช่า
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Display mode - show tenant details */}
            {!editingTenant && tenantDetails && (
              <div className="space-y-4">
                <div className="rounded-md bg-blue-50 p-4 flex items-center gap-3">
                  <User className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium text-blue-800">{tenantDetails.name}</p>
                    <p className="text-sm text-blue-700">ID: {tenantDetails.id}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-1 gap-3 mt-4 transition-all duration-200">
                  <div className="col-span-2 md:col-span-1">
                    <p className="text-sm text-gray-500 mb-1">อีเมล</p>
                    <div className="flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-gray-400" />
                      <p className="font-medium">{tenantDetails.email}</p>
                    </div>
                  </div>
                  <div className="col-span-2   md:col-span-1">
                    <p className="text-sm text-gray-500 mb-1">เบอร์โทรศัพท์</p>
                    <div className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-gray-400" />
                      <p className="font-medium">{tenantDetails.phone}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            {editingTenant ? (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => setEditingTenant(false)}
                  className="w-full sm:w-auto"
                >
                  ยกเลิก
                </Button>
                <Button
                  onClick={handleSaveTenantChanges}
                  className="w-full sm:w-auto"
                >
                  บันทึกการเปลี่ยนแปลง
                </Button>
              </>
            ) : (
              <>
                {rooms.find(r => r.roomNumber === selectedRoom)?.status === "occupied" && (
                  <Button 
                    variant="outline" 
                    onClick={handleDeleteTenant}
                    className="w-full sm:w-auto text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    ลบผู้เช่า
                  </Button>
                )}
                <Button
                  onClick={handleEditTenant}
                  className="w-full sm:w-auto"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  แก้ไขผู้เช่า
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Tenant</AlertDialogTitle>
            <AlertDialogDescription>
              คุณแน่ใจหรือไม่ว่าต้องการลบผู้เช่ารายนี้ออกจากห้อง {selectedRoom}? 
              ห้องนี้จะถูกเปลี่ยนสถานะเป็น "ไม่มีผู้เช่า"
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDeleteTenant}>
              ยกเลิก
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteTenant}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              ลบผู้เช่า
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TenantsPage;