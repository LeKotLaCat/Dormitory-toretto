"use client"

import React, { useState, useRef, useEffect } from 'react';
import { 
  Send,
  MessageSquare,
  Clock,
  AlertTriangle,
  Info,
  X,
  ChevronDown
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import SidebarUser from '@/components/SidebarUser';
import Footer from '@/components/Footer';
import { formatDistanceToNow } from 'date-fns';
import { th } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Message type
type Message = {
  id: number;
  content: string;
  timestamp: Date;
};

const ChatPage = () => {
  // Sample initial messages
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, content: "สวัสดีทุกคน มีใครเคยใช้เครื่องซักผ้าที่ชั้น 1 ไหมครับ รู้สึกว่าเครื่องที่ 2 จะมีปัญหานิดหน่อย", timestamp: new Date(2025, 2, 28, 9, 15) },
    { id: 2, content: "ใช่ค่ะ เครื่องที่ 2 มีปัญหาจริงๆ ทางหอกำลังซ่อมอยู่ ใช้เครื่องที่ 3 ไปก่อนนะคะ", timestamp: new Date(2025, 2, 28, 10, 30) },
    { id: 3, content: "มีใครสนใจร่วมสั่งอาหารกลุ่มไหมครับ เรามีส่วนลดจาก Grab ถ้าสั่ง 500+", timestamp: new Date(2025, 2, 28, 14, 45) },
    { id: 4, content: "ขอประชาสัมพันธ์ว่าคืนนี้จะมีการทำความสะอาดระบบท่อน้ำ อาจมีน้ำไหลช้าบ้างในช่วงเวลา 22.00-24.00 น.", timestamp: new Date(2025, 2, 28, 16, 20) },
    { id: 5, content: "น้ำประปาบนชั้น 5 ไม่ไหลเลยตอนนี้ มีใครเจอปัญหาเหมือนกันไหม?", timestamp: new Date(2025, 3, 1, 8, 10) },
    { id: 6, content: "ชั้น 5 ก็เจอเหมือนกันค่ะ ทางหอบอกว่าจะมาแก้ให้ในช่วงสาย", timestamp: new Date(2025, 3, 1, 8, 25) },
    { id: 7, content: "ชั้น 5 ก็เจอเหมือนกันค่ะ ทางหอบอกว่าจะมาแก้ให้ในช่วงสาย", timestamp: new Date(2025, 3, 1, 8, 25) },
    { id: 8, content: "ชั้น 5 ก็เจอเหมือนกันค่ะ ทางหอบอกว่าจะมาแก้ให้ในช่วงสาย", timestamp: new Date(2025, 3, 1, 8, 25) },
    { id: 9, content: "ชั้น 5 ก็เจอเหมือนกันค่ะ ทางหอบอกว่าจะมาแก้ให้ในช่วงสาย", timestamp: new Date(2025, 3, 1, 8, 25) },
    { id: 10, content: "ชั้น 5 ก็เจอเหมือนกันค่ะ ทางหอบอกว่าจะมาแก้ให้ในช่วงสาย", timestamp: new Date(2025, 3, 1, 8, 25) },
    { id: 11, content: "ชั้น 5 ก็เจอเหมือนกันค่ะ ทางหอบอกว่าจะมาแก้ให้ในช่วงสาย", timestamp: new Date(2025, 3, 1, 8, 25) },
    { id: 12, content: "ชั้น 5 ก็เจอเหมือนกันค่ะ ทางหอบอกว่าจะมาแก้ให้ในช่วงสาย", timestamp: new Date(2025, 3, 1, 8, 25) },
    { id: 13, content: "ชั้น 5 ก็เจอเหมือนกันค่ะ ทางหอบอกว่าจะมาแก้ให้ในช่วงสาย", timestamp: new Date(2025, 3, 1, 8, 25) },
    { id: 14, content: "ชั้น 5 ก็เจอเหมือนกันค่ะ ทางหอบอกว่าจะมาแก้ให้ในช่วงสาย", timestamp: new Date(2025, 3, 1, 8, 25) },
    { id: 15, content: "ชั้น 5 ก็เจอเหมือนกันค่ะ ทางหอบอกว่าจะมาแก้ให้ในช่วงสาย", timestamp: new Date(2025, 3, 1, 8, 25) },
    { id: 16, content: "ชั้น 5 ก็เจอเหมือนกันค่ะ ทางหอบอกว่าจะมาแก้ให้ในช่วงสาย", timestamp: new Date(2025, 3, 1, 8, 25) },
    { id: 17, content: "ชั้น 5 ก็เจอเหมือนกันค่ะ ทางหอบอกว่าจะมาแก้ให้ในช่วงสาย", timestamp: new Date(2025, 3, 1, 8, 25) },
    { id: 18, content: "ชั้น 5 ก็เจอเหมือนกันค่ะ ทางหอบอกว่าจะมาแก้ให้ในช่วงสาย", timestamp: new Date(2025, 3, 1, 8, 25) },
    { id: 19, content: "ชั้น 5 ก็เจอเหมือนกันค่ะ ทางหอบอกว่าจะมาแก้ให้ในช่วงสาย", timestamp: new Date(2025, 3, 1, 8, 25) },
    { id: 20, content: "ชั้น 5 ก็เจอเหมือนกันค่ะ ทางหอบอกว่าจะมาแก้ให้ในช่วงสาย", timestamp: new Date(2025, 3, 1, 8, 25) },
    { id: 21, content: "ชั้น 5 ก็เจอเหมือนกันค่ะ ทางหอบอกว่าจะมาแก้ให้ในช่วงสาย", timestamp: new Date(2025, 3, 1, 8, 25) },
    { id: 22, content: "ชั้น 5 ก็เจอเหมือนกันค่ะ", timestamp: new Date(2025, 2, 1, 8, 25) },
  ]);

  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  const handleSubmitMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newMessage.trim() === "") return;
    
    const message: Message = {
      id: messages.length + 1,
      content: newMessage,
      timestamp: new Date()
    };
    
    setMessages([...messages, message]);
    setNewMessage("");
  };

  // Function to format date in Thai language
  const formatMessageTime = (date: Date) => {
    return formatDistanceToNow(date, { locale: th });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex flex-1">
        <SidebarUser />
        
        <main className="flex-1 p-6 pt-16 md:pt-6 overflow-hidden flex flex-col h-screen">
          <div className="container mx-auto flex flex-col flex-1">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                <MessageSquare className="w-6 h-6 mr-2 text-primary" />
                บอร์ดสนทนาหอพัก
              </h1>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    กฎการใช้งาน
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="max-w-md">
                  <AlertDialogHeader>
                    <AlertDialogTitle>กฎการใช้งานบอร์ดสนทนา</AlertDialogTitle>
                    <AlertDialogDescription>
                      กรุณาปฏิบัติตามกฎเหล่านี้เพื่อสร้างพื้นที่ที่เป็นมิตรสำหรับทุกคน
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="space-y-2 mb-4">
                    <div className="flex gap-2">
                      <span className="font-bold">1.</span>
                      <p>ห้ามโพสต์ข้อความที่มีเนื้อหาไม่เหมาะสม คุกคาม หรือสร้างความเกลียดชัง</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold">2.</span>
                      <p>แม้จะเป็นข้อความนิรนาม แต่ทางผู้ดูแลสามารถระบุตัวผู้โพสต์ได้หากมีการละเมิดกฎ</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold">3.</span>
                      <p>ห้ามโพสต์ข้อมูลส่วนตัวของผู้อื่นโดยไม่ได้รับอนุญาต</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold">4.</span>
                      <p>ใช้พื้นที่นี้ในการสื่อสารและแบ่งปันข้อมูลที่เป็นประโยชน์ต่อผู้พักอาศัย</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold">5.</span>
                      <p>การรายงานปัญหาเกี่ยวกับห้องพักหรือสิ่งอำนวยความสะดวก ควรแจ้งผ่านระบบแจ้งซ่อมโดยตรง</p>
                    </div>
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogAction>เข้าใจแล้ว</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            
            <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col overflow-hidden mb-4">
              <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2 text-gray-600" />
                  <span className="font-medium">แชททั้งหมด ({messages.length})</span>
                </div>
                <div className="text-sm text-gray-500 flex items-center">
                  <Info className="w-4 h-4 mr-1" />
                  ทุกคนสามารถเห็นข้อความนี้
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[calc(100vh-250px)]">
                {messages.map((message) => (
                  <div key={message.id} className="bg-gray-50 rounded-lg p-4 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div className="flex whitespace-normal">
                        <p className="text-gray-800 break-words">{message.content}</p>
                      </div>
                    </div>
                    <div className="flex justify-end mt-2">
                      <span className="text-xs text-gray-500 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatMessageTime(message.timestamp)}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              
              <div className="p-4 border-t border-gray-200">
                <form onSubmit={handleSubmitMessage} className="flex gap-2">
                  <Input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="พิมพ์ข้อความของคุณที่นี่..."
                    className="flex-1"
                  />
                  <Button 
                    type="submit" 
                    className="flex items-center gap-2"
                    disabled={newMessage.trim() === ""}
                  >
                    <Send className="w-4 h-4" />
                    ส่ง
                  </Button>
                </form>
                <p className="text-xs text-primary mt-4 flex items-start">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  ข้อความจะถูกโพสต์แบบไม่ระบุตัวตน แต่ต้องเป็นไปตาม
                  กฎการใช้งาน
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default ChatPage;