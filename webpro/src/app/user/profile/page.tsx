"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Home, 
  Save,
  ArrowLeft,
  Upload,
} from 'lucide-react';
import SidebarUser from '@/components/SidebarUser';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const EditProfilePage = () => {
  const router = useRouter();
  
  // Mock user profile data - this would come from your API/database in a real application
  const [profile, setProfile] = useState({
    FirstName: "ณฐกร",
    lastName: "หอมพันนา",
    roomNumber: "401",
    roomType: "Type A",
    email: "66070055@kmitl.ac.th",
    phone: "062-345-6789",
    address: "123/45 ถนนฉลองกรุง แขวงลาดกระบัง เขตลาดกระบัง กรุงเทพฯ 10520",
    profileImage: "/profile/namon.jpg"
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(profile.profileImage);
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real application, you would upload this to your server/cloud storage
      // Here we're just creating a local URL for preview
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call to update profile
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real application, you would send the updated profile to your API
      // If the image was changed, you would upload it first, then update the profile with the new image URL
      
      toast.success("โปรไฟล์ถูกอัปเดตเรียบร้อยแล้ว", {
        description: "ข้อมูลส่วนตัวของคุณได้รับการอัปเดตแล้ว"
      });
      
      // Redirect back to the profile page after successful update
      router.push('/user/main');
    } catch (error) {
      toast.error("เกิดข้อผิดพลาดในการอัปเดตโปรไฟล์", {
        description: "โปรดลองใหม่อีกครั้ง"
      });
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle cancel
  const handleCancel = () => {
    router.back();
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex flex-1">
        <SidebarUser />
        
        <main className="flex-1 p-6 pt-16 md:pt-6 overflow-auto pb-16">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleCancel}
                className="mr-4 text-sm"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                ย้อนกลับ
              </Button>
          <div className="container mx-auto max-w-3xl">
            <div className="flex items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">แก้ไขโปรไฟล์</h1>
            </div>
            
            <form onSubmit={handleSubmit}>
              <Card className="mb-6 overflow-hidden">
                <CardHeader className="pb-0">
                  <CardTitle>ข้อมูลส่วนตัว</CardTitle>
                </CardHeader>
                
                <CardContent className="pt-6">
                  {/* Profile Image */}
                  <div className="flex flex-col items-center mb-6">
                    <div className="relative w-32 h-32 overflow-hidden rounded-full border-4 border-primary/20 mb-4">
                      <Image 
                        src={imagePreview} 
                        alt={profile.FirstName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    <div className="flex items-center">
                      <label 
                        htmlFor="profileImage" 
                        className="cursor-pointer bg-primary/10 text-primary hover:bg-primary/20 px-4 py-2 rounded-md flex items-center transition-colors"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        อัปโหลดรูปภาพ
                      </label>
                      <input 
                        type="file" 
                        id="profileImage" 
                        accept="image/*"
                        className="hidden" 
                        onChange={handleImageChange} 
                      />
                    </div>
                  </div>
                  
                  {/* Personal Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">ชื่อ</label>
                      <div className="relative">
                        <div className="absolute left-3 top-3 text-gray-400">
                          <User className="h-4 w-4" />
                        </div>
                        <Input 
                          id="name"
                          name="name"
                          value={profile.FirstName}
                          onChange={handleInputChange}
                          className="pl-10"
                          placeholder="ชื่อ"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-1">นามสกุล</label>
                      <div className="relative">
                        <div className="absolute left-3 top-3 text-gray-400">
                          <User className="h-4 w-4" />
                        </div>
                        <Input 
                          id="lastName"
                          name="lastName"
                          value={profile.lastName}
                          onChange={handleInputChange}
                          className="pl-10"
                          placeholder="นามสกุล"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">อีเมล</label>
                      <div className="relative">
                        <div className="absolute left-3 top-3 text-gray-400">
                          <Mail className="h-4 w-4" />
                        </div>
                        <Input 
                          id="email"
                          name="email"
                          type="email"
                          value={profile.email}
                          onChange={handleInputChange}
                          className="pl-10"
                          placeholder="อีเมล"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">เบอร์โทรศัพท์</label>
                      <div className="relative">
                        <div className="absolute left-3 top-3 text-gray-400">
                          <Phone className="h-4 w-4" />
                        </div>
                        <Input 
                          id="phone"
                          name="phone"
                          value={profile.phone}
                          onChange={handleInputChange}
                          className="pl-10"
                          placeholder="เบอร์โทรศัพท์"
                        />
                      </div>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">ที่อยู่</label>
                      <div className="relative">
                        <div className="absolute left-3 top-3 text-gray-400">
                          <MapPin className="h-4 w-4" />
                        </div>
                        <Textarea 
                          id="address"
                          name="address"
                          value={profile.address}
                          onChange={handleInputChange}
                          className="pl-10 min-h-[80px]"
                          placeholder="ที่อยู่"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="roomNumber" className="block text-sm font-medium text-gray-700 mb-1">ห้องพัก</label>
                      <div className="relative">
                        <div className="absolute left-3 top-3 text-gray-400">
                          <MapPin className="h-4 w-4" />
                        </div>
                        <Input 
                          id="roomNumber"
                          name="roomNumber"
                          value={profile.roomNumber}
                          disabled
                          className="pl-10 bg-gray-50"
                          placeholder="หมายเลขห้อง"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="roomType" className="block text-sm font-medium text-gray-700 mb-1">ประเภทห้อง</label>
                      <div className="relative">
                        <div className="absolute left-3 top-3 text-gray-400">
                          <Home className="h-4 w-4" />
                        </div>
                        <Input 
                          id="roomType"
                          name="roomType"
                          value={profile.roomType}
                          disabled
                          className="pl-10 bg-gray-50"
                          placeholder="ประเภทห้อง"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex justify-end space-x-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleCancel}
                >
                  ยกเลิก
                </Button>
                <Button 
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>กำลังบันทึก...</>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      บันทึกข้อมูล
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default EditProfilePage;