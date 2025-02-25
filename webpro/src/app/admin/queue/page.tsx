"use client"

import React, { useState, useEffect  } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
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
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  CheckIcon,
  ChevronDownIcon,
  Clock,
  Home,
  Phone,
  User,
  Mail,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { movingIn } from '@/components/data';



const ITEMS_PER_PAGE = 4;

const AdminQueue = () => {
  const [queueList, setQueueList] = useState(movingIn);

  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [selectedQueueItem, setSelectedQueueItem] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(queueList.length / ITEMS_PER_PAGE);

  const currentItems = queueList.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleToggleExpand = (id: number) => {
    setQueueList(queueList.map(item => 
      item.id === id ? { ...item, expanded: !item.expanded } : item
    ));
  };

  const handleAccept = (id: number) => {
    setQueueList(queueList.map(item => 
      item.id === id ? { ...item, expanded: true } : item
    ));
  };

  const handleConfirmAccept = (id: number) => {
    setQueueList(queueList.map(item => 
      item.id === id ? { ...item, status: 'accepted' } : item
    ));
    // Here you would typically make an API call to update the database
    //Done!
  };

  const handleRejectClick = (id: number) => {
    setSelectedQueueItem(id);
    setIsRejectDialogOpen(true);
  };

  const handleConfirmReject = () => {
    setQueueList(queueList.map(item => 
      item.id === selectedQueueItem ? { ...item, status: 'rejected' } : item
    ));
    // Here you would typically make an API call to update the database
    setIsRejectDialogOpen(false);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col overflow-auto">
      <div className="flex flex-1">
          <Sidebar />
        <main className="h-screen flex-1 overflow-auto">
            <div className='p-6 pt-16 md:pt-6'>
                <div className="container mx-auto">
                    <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Room Viewing Queue</h1>
                    <div className="flex space-x-4">
                        <Button variant="outline">
                        Filter
                        </Button>
                        <Button>
                        Schedule Tour
                        </Button>
                    </div>
                    </div>

                    <div className="mb-4 flex items-center justify-between">
                    <p className="text-gray-600">Showing {queueList.filter(item => item.status === 'pending').length} pending requests</p>
                    <div className="flex items-center space-x-2">
                        <p className="text-sm text-gray-500">
                        Page {currentPage} of {totalPages}
                        </p>
                    </div>
                    </div>

                    <div className="space-y-4">
                    {currentItems.map((item) => (
                        <Card key={item.id} className={`transition-all duration-500 ease-in-out ${item.status !== 'pending' ? 'opacity-60' : ''}`}>
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                            <div>
                                <CardTitle>{item.name}</CardTitle>
                                <CardDescription className="flex items-center gap-2 mt-1">
                                <Clock size={14} />
                                Requested {formatDistanceToNow(new Date(item.requestedOn), { addSuffix: true })}
                                </CardDescription>
                            </div>
                            <div>
                            <AnimatePresence mode="wait">
                                {item.status === 'pending' ? (
                                    <motion.div 
                                    key="pending"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.3 }}
                                    >
                                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                        Pending
                                    </Badge>
                                    </motion.div>
                                ) : item.status === 'accepted' ? (
                                    <motion.div 
                                    key="accepted"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.3 }}
                                    >
                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                        Accepted
                                    </Badge>
                                    </motion.div>
                                ) : (
                                    <motion.div 
                                    key="rejected"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.3 }}
                                    >
                                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                        Rejected
                                    </Badge>
                                    </motion.div>
                                )}
                                </AnimatePresence>
                            </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                            <div className="flex items-center gap-2">
                                <Home size={16} className="text-gray-500" />
                                <span className="text-sm">{item.preferredRoom}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CalendarIcon size={16} className="text-gray-500" />
                                <span className="text-sm">
                                {item.preferredDate.toLocaleDateString('en-US', { 
                                    weekday: 'short', 
                                    day: 'numeric', 
                                    month: 'short', 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                })}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone size={16} className="text-gray-500" />
                                <span className="text-sm">{item.phone}</span>
                            </div>
                            </div>
                            
                            <Collapsible open={item.expanded}>
                            <CollapsibleContent className="mt-4 pt-4 border-t transition-all duration-300 ease-in-out">
                                <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4   animate-fadeIn">
                                    <div className='transition duration-300 ease-in-out transform hover:bg-gray-50 p-2 rounded'>
                                    <h4 className="text-sm font-medium text-gray-500 mb-1">Student ID</h4>
                                    <p className="text-sm">{item.additionalInfo.studentId}</p>
                                    </div>
                                    <div  className='transition duration-300 ease-in-out transform hover:bg-gray-50 p-2 rounded'>
                                    <h4 className="text-sm font-medium text-gray-500 mb-1">Email</h4>
                                    <p className="text-sm">{item.email}</p>
                                    </div>
                                    <div className='transition duration-300 ease-in-out transform hover:bg-gray-50 p-2 rounded'>
                                    <h4 className="text-sm font-medium text-gray-500 mb-1">Faculty</h4>
                                    <p className="text-sm">{item.additionalInfo.faculty}</p>
                                    </div>
                                    <div className='transition duration-300 ease-in-out transform hover:bg-gray-50 p-2 rounded'>
                                    <h4 className="text-sm font-medium text-gray-500 mb-1">Year of Study</h4>
                                    <p className="text-sm">{item.additionalInfo.yearOfStudy}</p>
                                    </div>
                                    <div className='transition duration-300 ease-in-out transform hover:bg-gray-50 p-2 rounded'>
                                    <h4 className="text-sm font-medium text-gray-500 mb-1">Budget Range</h4>
                                    <p className="text-sm">{item.additionalInfo.budgetRange}</p>
                                    </div>
                                    <div className='transition duration-300 ease-in-out transform hover:bg-gray-50 p-2 rounded'>
                                    <h4 className="text-sm font-medium text-gray-500 mb-1">Planned Moving Date</h4>
                                    <p className="text-sm">
                                        {item.additionalInfo.movingDate.toLocaleDateString('en-US', { 
                                        day: 'numeric', 
                                        month: 'short', 
                                        year: 'numeric'
                                        })}
                                    </p>
                                    </div>
                                    <div className="md:col-span-2 transition duration-300 ease-in-out transform hover:bg-gray-50 p-2 rounded">
                                    <h4 className="text-sm font-medium text-gray-500 mb-1">Special Requests</h4>
                                    <p className="text-sm">{item.additionalInfo.specialRequests}</p>
                                    </div>
                                </div>
                                
                                {item.status === 'pending' && (
                                    <div className="flex justify-end mt-4  animate-fadeIn">
                                    <Button 
                                        onClick={() => handleConfirmAccept(item.id)}
                                        className="w-full md:w-auto transition-all duration-300 ease-in-out transform hover:scale-105"
                                    >
                                        <CheckIcon className="mr-2 h-4 w-4" />
                                        Confirm Appointment
                                    </Button>
                                    </div>
                                )}
                                </div>
                            </CollapsibleContent>
                            </Collapsible>
                        </CardContent>
                        
                        {item.status === 'pending' && !item.expanded && (
                            <CardFooter className="border-t pt-4 flex justify-end gap-3">
                            <Button 
                                variant="outline" 
                                onClick={() => handleRejectClick(item.id)}
                                className="transition-all duration-200 ease-in-out hover:bg-red-50"
                            >
                                <X className="mr-2 h-4 w-4" />
                                Reject
                            </Button>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button 
                                onClick={() => handleAccept(item.id)}
                                className="transition-all duration-300 ease-in-out"
                                >
                                <CheckIcon className="mr-2 h-4 w-4" />
                                Accept
                                </Button>
                            </motion.div>
                            </CardFooter>
                        )}
                        </Card>
                    ))}
                    </div>

                    <div className="flex justify-center mt-6 space-x-2">
                    <Button 
                        variant="outline" 
                        onClick={goToPreviousPage} 
                        disabled={currentPage === 1}
                        size="sm"
                    >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                    </Button>
                    <Button 
                        variant="outline" 
                        onClick={goToNextPage} 
                        disabled={currentPage === totalPages}
                        size="sm"
                    >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                    </div>
                    </div>
            </div>
        </main>
      </div>

      <Footer />

      <AlertDialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will reject the room viewing request. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmReject} className="bg-red-500 hover:bg-red-600 text-white">
              Reject Request
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminQueue;