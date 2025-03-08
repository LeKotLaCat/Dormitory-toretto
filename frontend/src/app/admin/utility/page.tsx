"use client";

import React, { useState, useEffect, useRef } from "react";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Search,
  Home,
  Plus,
  Check,
  Calendar,
  Zap,
  Droplets,
  PlusCircle,
  X,
  Scissors,
  Wrench,
  ShowerHead,
  Printer,
  CheckCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import Image from "next/image";
import { initialRooms } from "@/components/data";

interface AdditionalFee {
  type: "housewife" | "fixing" | "laundry" | "internet" | "other";
  amount: number;
  description: string;
}

interface UtilityRecord {
  id: number;
  roomNumber: string;
  month: string;
  electric: number;
  water: number;
  roomFee: number;
  additionalFees: AdditionalFee[];
  status: "paid" | "unpaid";
  dueDate: Date;
  paidDate?: Date;
  imageFile?: string;
}

interface NewUtility {
  id: number;
  roomNumber: string;
  month: string;
  electric: number;
  water: number;
  additionalFees: AdditionalFee[];
  status: "paid" | "unpaid";
  dueDate: Date;
}

const UtilityPage = () => {
  // Sample utility data
  const initialUtilityData: UtilityRecord[] = [
    {
      id: 1,
      roomNumber: "101",
      month: "Feb 2025",
      electric: 750,
      water: 250,
      roomFee: 1000,
      additionalFees: [
        {
          type: "housewife",
          amount: 400,
          description: "Weekly cleaning service",
        },
      ],
      status: "unpaid",
      dueDate: new Date(2025, 2, 15),
      imageFile:
        "https://www.it.kmitl.ac.th/wp-content/themes/itkmitl2017wp/img/life/life-13.jpg",
    },
    {
      id: 2,
      roomNumber: "102",
      month: "Feb 2025",
      electric: 820,
      water: 320,
      roomFee: 1000,
      additionalFees: [],
      status: "paid",
      paidDate: new Date(2025, 2, 10),
      dueDate: new Date(2025, 2, 15),
      imageFile:
        "https://www.it.kmitl.ac.th/wp-content/themes/itkmitl2017wp/img/life/life-13.jpg",
    },
    {
      id: 3,
      roomNumber: "201",
      month: "Feb 2025",
      electric: 680,
      water: 190,
      roomFee: 1000,
      additionalFees: [
        { type: "fixing", amount: 350, description: "Sink repair" },
      ],
      status: "unpaid",
      dueDate: new Date(2025, 2, 15),
      imageFile:
        "https://www.it.kmitl.ac.th/wp-content/themes/itkmitl2017wp/img/life/life-13.jpg",
    },
    {
      id: 4,
      roomNumber: "202",
      month: "Feb 2025",
      electric: 920,
      water: 280,
      roomFee: 1000,
      additionalFees: [
        {
          type: "housewife",
          amount: 400,
          description: "Weekly cleaning service",
        },
        {
          type: "fixing",
          amount: 600,
          description: "Air conditioner maintenance",
        },
      ],
      status: "paid",
      paidDate: new Date(2025, 2, 8),
      dueDate: new Date(2025, 2, 15),
      imageFile:
        "https://www.it.kmitl.ac.th/wp-content/themes/itkmitl2017wp/img/life/life-13.jpg",
    },
    {
      id: 5,
      roomNumber: "101",
      month: "Jan 2025",
      electric: 720,
      water: 230,
      roomFee: 1000,
      additionalFees: [],
      status: "paid",
      paidDate: new Date(2025, 1, 14),
      dueDate: new Date(2025, 1, 15),
      imageFile:
        "https://www.it.kmitl.ac.th/wp-content/themes/itkmitl2017wp/img/life/life-13.jpg",
    },
    {
      id: 6,
      roomNumber: "102",
      month: "Jan 2025",
      electric: 790,
      water: 310,
      roomFee: 1000,
      additionalFees: [
        { type: "fixing", amount: 500, description: "Door lock replacement" },
      ],
      status: "paid",
      paidDate: new Date(2025, 1, 12),
      dueDate: new Date(2025, 1, 15),
      imageFile:
        "https://www.it.kmitl.ac.th/wp-content/themes/itkmitl2017wp/img/life/life-13.jpg",
    },
  ];
  const [rooms, setRoom] = useState(
    initialRooms.map((room, index) => ({
      id: index + 1,
      ...room,
    }))
  );

  useEffect(() => {
    fetch("http://localhost:3000/rooms", {
      method: "GET",
      credentials: "include",
    })
      .then((jso) => {
        return jso.json();
      })
      .then((da: any) => {
        console.log(da);
        const nda = da["rooms"].map((item: any) => {
          let roomprice = 0;
          switch (item.roomTypeId) {
            case "A":
              roomprice = 8400;
              break;
            case "B":
              roomprice = 12000;
              break;
            case "C":
              roomprice = 13400;
              break;
          }
          // 8400 12000 13400
          return {
            id: item.id,
            roomNumber: item.roomName,
            floor: item.floor,
            type: item.roomTypeId,
            status: item.renterID ? "occupied" : "vacent",
            tenantId: item.renterID,
            monthlyRent: roomprice,
          };
        });

        setRoom(nda);
      });
    fetch("http://localhost:3000/bills", {
      method: "GET",
      credentials: "include",
    })
      .then((js) => {
        return js.json();
      })
      .then((data) => {
        if (!data) return;
        const newdata = data.map((s: any) => {
          console.log(s);
          return {
            id: s.BillID,
            roomNumber: rooms.find(v => v.id === s.RoomID)?.roomNumber,
            month: format(new Date(s.billMonth), "MMM yyyy"),
            electric: Number.parseFloat(s.electricprice),
            water: Number.parseFloat(s.waterprice),
            additionalFees: JSON.parse(s.additionalFees) as AdditionalFee[],
            roomFee: s.roomprice,
            status: s.billStatus == 2 ? "paid" : "unpaid",
            dueDate: new Date(s.DueDate),
            paidDate: s.paidDate && new Date(s.paidDate),
            imageFile:
              s.transactionimg ||
              "https://www.it.kmitl.ac.th/wp-content/themes/itkmitl2017wp/img/life/life-13.jpg",
          } as UtilityRecord;
        });
        setUtilityData(newdata);
      });
  }, []);
  const [feenotfromfetch, setFeenotfromfetch] = useState([] as AdditionalFee[])
  const [utilityData, setUtilityData] =
    useState<UtilityRecord[]>(initialUtilityData);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMonth, setFilterMonth] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newUtility, setNewUtility] = useState<NewUtility>({
    id:0,
    roomNumber: "",
    month: format(new Date(), "MMM yyyy"),
    electric: 0,
    water: 0,
    additionalFees: [],
    status: "unpaid",
    dueDate: new Date(new Date().setDate(15)),
  });

  const [showAddFee, setShowAddFee] = useState(false);
  const [newFee, setNewFee] = useState<AdditionalFee>({
    type: "housewife",
    amount: 0,
    description: "",
  });

  const [previewItem, setPreviewItem] = useState<number | null>(null);
  const [isReceiptDialogOpen, setIsReceiptDialogOpen] = useState(false);

  const handleConfirmPayment = (id: number) => {
    // Find the utility item
    const item = utilityData.find((item) => item.id === id);
    fetch(`http://localhost:3000/bills/${id}/confirmPayment`, {
      method: "PUT",
      credentials: "include",
    }).catch((ex) => {
      console.error(ex);
    });
    if (!item) return;

    // Update the utility data
    setUtilityData(
      utilityData.map((item) =>
        item.id === id
          ? { ...item, status: "paid", paidDate: new Date() }
          : item
      )
    );

    // Close any open dialogs
    setIsReceiptDialogOpen(false);

    // Optional: Show a success notification
    // You can add a toast notification here if you have a toast component

    // Reset the preview item
    setPreviewItem(null);
  };

  // Get unique months from utility data
  const months = [...new Set(utilityData.map((item) => item.month))].sort(
    (a, b) => {
      const [aMonth, aYear] = a.split(" ");
      const [bMonth, bYear] = b.split(" ");
      return new Date(`${aMonth} 1, ${aYear}`) <
        new Date(`${bMonth} 1, ${bYear}`)
        ? 1
        : -1;
    }
  );

  // Filter utility data
  const filteredData = utilityData.filter((item) => {
    // Filter by search term
    const matchesSearch = item.roomNumber
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    // Filter by month
    const matchesMonth = filterMonth === "all" || item.month === filterMonth;

    // Filter by status
    const matchesStatus =
      filterStatus === "all" || item.status === filterStatus;

    return matchesSearch && matchesMonth && matchesStatus;
  });

  // Handle adding new fee to the utility record
  const handleAddFee = () => {
    if (newFee.amount <= 0 || !newFee.description.trim()) {
      alert("Please enter a valid amount and description");
      return;
    }
    setFeenotfromfetch([...feenotfromfetch,{ ...newFee, amount: Number(newFee.amount) }]);
    console.log(feenotfromfetch)
    setNewUtility({
      ...newUtility,
      additionalFees: [
        ...newUtility.additionalFees,
        { ...newFee, amount: Number(newFee.amount) },
      ],
    });

    // Reset fee form
    setNewFee({
      type: "housewife",
      amount: 0,
      description: "",
    });
    setShowAddFee(false);
  };

  // Handle removing fee from the utility record
  const handleRemoveFee = (index: number) => {
    const updatedFees = [...newUtility.additionalFees];
    updatedFees.splice(index, 1);
    setNewUtility({
      ...newUtility,
      additionalFees: updatedFees,
    });
  };

  // Handle adding new utility record
  const handleAddUtility = () => {
    // Validate input data
    if (
      !newUtility.roomNumber ||
      newUtility.electric < 0 ||
      newUtility.water < 0
    ) {
      alert("Please fill in all required fields with valid values");
      return;
    }

    // Check if room exists
    if (!rooms.find((room) => room.roomNumber === newUtility.roomNumber)) {
      alert("Room number does not exist");
      return;
    }

    // Check for duplicates
    const duplicate = utilityData.find(
      (item) =>
        item.roomNumber === newUtility.roomNumber &&
        item.month === newUtility.month
    );
    if (duplicate) {
      alert(
        `Utility for Room ${newUtility.roomNumber} in ${newUtility.month} already exists`
      );
      return;
    }
    const taskprice: number = newUtility.additionalFees.reduce(
      (accumulator: number, currentValue: AdditionalFee) => {
        return accumulator + currentValue.amount;
      },
      0
    );
    const RoomID = rooms.find((v)=> v.roomNumber === newUtility.roomNumber)?.id
    const roomprice = rooms.find((v) => v.roomNumber === newUtility.roomNumber)?.monthlyRent;
    console.log(RoomID,roomprice)
    console.log(rooms)
    fetch("http://localhost:3000/bills", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        RoomID,
        billMonth: newUtility.month,
        DueDate: newUtility.dueDate,
        waterprice: newUtility.water,
        electricprice: newUtility.electric,
        taskprice,
        roomprice,
        additionalFees: newUtility.additionalFees
      }),
    }).catch((ex) => {
      console.error(ex);
    });

    // Add new utility record
    const newItem = {
      ...newUtility,
      id: Math.max(...utilityData.map((item) => item.id), 0) + 1,
      electric: Number(newUtility.electric),
      water: Number(newUtility.water),
      roomFee: 8000
    };

    setUtilityData([newItem, ...utilityData]);
    setIsAddDialogOpen(false);
    setNewUtility({
      id:0,
      roomNumber: "",
      month: format(new Date(), "MMM yyyy"),
      electric: 0,
      water: 0,
      additionalFees: [],
      status: "unpaid",
      dueDate: new Date(new Date().setDate(15)),
    });
  };

  // Get stats for current month
  const currentMonth =
    new Date().toLocaleString("default", { month: "short" }) +
    " " +
    new Date().getFullYear();
  const currentMonthData = utilityData.filter(
    (item) => item.month === currentMonth
  );
  const unpaidCount = currentMonthData.filter(
    (item) => item.status === "unpaid"
  ).length;
  const totalElectric = currentMonthData.reduce(
    (sum, item) => sum + item.electric,
    0
  );
  const totalWater = currentMonthData.reduce(
    (sum, item) => sum + item.water,
    0
  );
  const totalAdditional = currentMonthData.reduce(
    (sum, item) =>
      sum + item.additionalFees.reduce((feeSum, fee) => feeSum + fee.amount, 0),
    0
  );
  let oldmonth = "";
  useEffect(() => {
    if (newUtility.roomNumber && newUtility.month && newUtility.month !== oldmonth) {
      oldmonth = newUtility.month;
  
      console.log("Old fees:", feenotfromfetch);
      
      // First, clear the previous additionalFees
      setNewUtility((prevUtility) => ({
        ...prevUtility,
        additionalFees: [], // Clear previous fees before fetching new data
      }));
  
      fetch(
        `http://localhost:3000/tasks?roomid=${
          rooms.find((i) => i.roomNumber == newUtility.roomNumber)?.id
        }&month=${newUtility.month}`,
        { method: "GET", credentials: "include" }
      )
        .then((jso) => jso.json())
        .then((value) => {
          console.log(value);
          if (value.length) {

            const newFees = value.map((s: any) => {
              return {
                amount: Number.parseFloat(s.taskprice),
                description: `จากการจ้าง ${s.taskname} ` + s.description,
                type: s.tasktype == "housekeeping" ? "housewife" : "fixing",
              } as AdditionalFee;
            });
  

            setNewUtility((prevUtility) => ({
              ...prevUtility,
              additionalFees: [
                ...newFees, // New fees first
                ...feenotfromfetch, // Then add old fees after
              ],
            }));
          } else {
            // If no new data, just show the old fees (feenotfromfetch)
            setNewUtility((prevUtility) => ({
              ...prevUtility,
              additionalFees: [...feenotfromfetch], // Only old fees
            }));
          }
        });
    }
  
    console.log(newUtility);
  }, [newUtility.roomNumber, newUtility.month]);
  
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col overflow-auto">
      <div className="flex flex-1">
        <Sidebar />
        <main className="h-screen flex-1 overflow-auto">
          <div className="p-6 pt-16 md:pt-6">
            <div className="container mx-auto">
              {/* Header and Actions */}
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-0">
                  Utility Cost Tracking
                </h1>
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      type="text"
                      placeholder="Search by room number..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 w-full"
                    />
                  </div>
                  <Button
                    onClick={() => setIsAddDialogOpen(true)}
                    className="w-full md:w-auto"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Utility
                  </Button>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Current Month</p>
                      <p className="text-2xl font-bold">{currentMonth}</p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-full">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Unpaid Bills</p>
                      <p className="text-2xl font-bold">{unpaidCount}</p>
                    </div>
                    <div className="bg-amber-100 p-3 rounded-full">
                      <X className="h-5 w-5 text-amber-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total Electric</p>
                      <p className="text-2xl font-bold">
                        ฿{totalElectric.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-yellow-100 p-3 rounded-full">
                      <Zap className="h-5 w-5 text-yellow-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total Water</p>
                      <p className="text-2xl font-bold">
                        ฿{totalWater.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-full">
                      <Droplets className="h-5 w-5 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Additional Fees</p>
                      <p className="text-2xl font-bold">
                        ฿{totalAdditional.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-full">
                      <PlusCircle className="h-5 w-5 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-3 mb-6">
                <Select value={filterMonth} onValueChange={setFilterMonth}>
                  <SelectTrigger className="w-full md:w-40">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>
                        {filterMonth === "all" ? "All Months" : filterMonth}
                      </span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Months</SelectItem>
                    {months.map((month) => (
                      <SelectItem key={month} value={month}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full md:w-40">
                    <div className="flex items-center">
                      <Check className="h-4 w-4 mr-2" />
                      <span>
                        {filterStatus === "all"
                          ? "All Status"
                          : filterStatus === "paid"
                          ? "Paid"
                          : "Unpaid"}
                      </span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="unpaid">Unpaid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Utility Table */}
              {filteredData.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500 mb-4">
                      No utility records found
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchTerm("");
                        setFilterMonth("all");
                        setFilterStatus("all");
                      }}
                    >
                      Reset Filters
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="bg-white rounded-md shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 text-left">
                          <th className="px-4 py-3 text-sm font-medium text-gray-700">
                            Room
                          </th>
                          <th className="px-4 py-3 text-sm font-medium text-gray-700">
                            Month
                          </th>
                          <th className="px-4 py-3 text-sm font-medium text-gray-700">
                            Electric (฿)
                          </th>
                          <th className="px-4 py-3 text-sm font-medium text-gray-700">
                            Water (฿)
                          </th>
                          <th className="px-4 py-3 text-sm font-medium text-gray-700">
                            Room Fee (฿)
                          </th>
                          <th className="px-4 py-3 text-sm font-medium text-gray-700">
                            Add. Fees
                          </th>
                          <th className="px-4 py-3 text-sm font-medium text-gray-700">
                            Total (฿)
                          </th>
                          <th className="px-4 py-3 text-sm font-medium text-gray-700">
                            Due Date
                          </th>
                          <th className="px-4 py-3 text-sm font-medium text-gray-700">
                            Status
                          </th>
                          <th className="px-4 py-3 text-sm font-medium text-gray-700">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filteredData.map((item) => {
                          // Calculate additional fees total
                          console.log(item)
                          const additionalTotal = item.additionalFees.reduce(
                            (sum, fee) => sum + fee.amount,
                            0
                          );
                          const totalAmount =
                            item.electric + item.water + additionalTotal + item.roomFee;

                          return (
                            <tr key={item.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3">
                                <div className="flex items-center">
                                  <Home className="h-4 w-4 text-gray-500 mr-2" />
                                  {item.roomNumber}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-gray-700">
                                {item.month}
                              </td>
                              <td className="px-4 py-3 text-gray-700">
                                {item.electric.toLocaleString()}
                              </td>
                              <td className="px-4 py-3 text-gray-700">
                                {item.water.toLocaleString()}
                              </td>
                              <td className="px-4 py-3 text-gray-700">
                                {item.roomFee.toLocaleString()}
                              </td>
                              <td className="px-4 py-3">
                                {additionalTotal > 0 ? (
                                  <div>
                                    <span className="font-medium text-gray-700">
                                      ฿{additionalTotal.toLocaleString()}
                                    </span>
                                    {item.additionalFees.length > 0 && (
                                      <div className="mt-1">
                                        {item.additionalFees.map(
                                          (fee, index) => (
                                            <Badge
                                              key={index}
                                              className="mr-1 mb-1 bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200"
                                            >
                                              {fee.type === "housewife" && (
                                                <ShowerHead className="h-3 w-3 mr-1 inline" />
                                              )}
                                              {fee.type === "fixing" && (
                                                <Wrench className="h-3 w-3 mr-1 inline" />
                                              )}
                                              {fee.type === "laundry" && (
                                                <Scissors className="h-3 w-3 mr-1 inline" />
                                              )}
                                              {fee.type} ฿
                                              {fee.amount.toLocaleString()}
                                            </Badge>
                                          )
                                        )}
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-gray-500 text-sm">
                                    -
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-3 font-medium text-gray-700">
                                {totalAmount.toLocaleString()}
                              </td>
                              <td className="px-4 py-3 text-gray-700">
                                {format(item.dueDate, "MMM d, yyyy")}
                              </td>
                              <td className="px-4 py-3">
                                <Badge
                                  className={
                                    item.status === "paid"
                                      ? "bg-green-50 text-green-600 border-green-200"
                                      : "bg-amber-50 text-amber-600 border-amber-200"
                                  }
                                >
                                  {item.status === "paid" && item.paidDate
                                    ? `Paid on ${format(
                                        item.paidDate,
                                        "MMM d"
                                      )}`
                                    : "Unpaid"}
                                </Badge>
                              </td>
                              <td className="px-4 py-3">
                                {item.status === "unpaid" && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 border-blue-200"
                                    onClick={() => {
                                      setPreviewItem(item.id);
                                      setIsReceiptDialogOpen(true);
                                    }}
                                  >
                                    <Printer className="h-4 w-4 mr-1" />
                                    Preview Receipt
                                  </Button>
                                )}
                                {item.status === "paid" && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-green-600 hover:text-green-800 hover:bg-green-50 border-green-200"
                                    onClick={() => {
                                      setPreviewItem(item.id);
                                      setIsReceiptDialogOpen(true);
                                    }}
                                  >
                                    <Printer className="h-4 w-4 mr-1" />
                                    View Receipt
                                  </Button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <Footer />

      {/* Add New Utility Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Utility Record</DialogTitle>
            <DialogDescription>
              Enter the utility details for a room
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="roomNumber">Room Number *</Label>
              <Select
                value={newUtility.roomNumber}
                onValueChange={(value) =>
                  setNewUtility({ ...newUtility, roomNumber: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select room number" />
                </SelectTrigger>
                <SelectContent>
                  {rooms.map((room) => (
                    <SelectItem key={room.roomNumber} value={room.roomNumber}>
                      Room {room.roomNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="month">Month *</Label>
              <Select
                value={newUtility.month}
                onValueChange={(value) =>
                  setNewUtility({ ...newUtility, month: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {/* Current month and previous 2 months */}
                  {[0, -1, -2].map((offset) => {
                    const date = new Date();
                    date.setMonth(date.getMonth() + offset);
                    const monthYear = format(date, "MMM yyyy");
                    return (
                      <SelectItem key={monthYear} value={monthYear}>
                        {monthYear}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="electric">Electricity Cost (฿) *</Label>
                <div className="relative">
                  <Zap className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    id="electric"
                    type="number"
                    className="pl-9"
                    min="0"
                    value={newUtility.electric}
                    onChange={(e) =>
                      setNewUtility({
                        ...newUtility,
                        electric: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="water">Water Cost (฿) *</Label>
                <div className="relative">
                  <Droplets className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    id="water"
                    type="number"
                    className="pl-9"
                    min="0"
                    value={newUtility.water}
                    onChange={(e) =>
                      setNewUtility({
                        ...newUtility,
                        water: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={format(newUtility.dueDate, "yyyy-MM-dd")}
                onChange={(e) =>
                  setNewUtility({
                    ...newUtility,
                    dueDate: e.target.value
                      ? new Date(e.target.value)
                      : new Date(new Date().setDate(15)),
                  })
                }
              />
            </div>

            {/* Additional fees section */}
            <div className="space-y-3 mt-4">
              <div className="flex items-center justify-between">
                <Label>Additional Fees</Label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setShowAddFee(true)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Fee
                </Button>
              </div>

              {/* List of additional fees */}
              {newUtility.additionalFees.length > 0 ? (
                <div className="space-y-2 mt-2">
                  {newUtility.additionalFees.map((fee, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 p-2 rounded-md"
                    >
                      <div>
                        <div className="flex items-center">
                          <Badge className="capitalize mr-2">
                            {fee.type === "housewife" && (
                              <ShowerHead className="h-3 w-3 mr-1 inline" />
                            )}
                            {fee.type === "fixing" && (
                              <Wrench className="h-3 w-3 mr-1 inline" />
                            )}
                            {fee.type === "laundry" && (
                              <Scissors className="h-3 w-3 mr-1 inline" />
                            )}
                            {fee.type}
                          </Badge>
                          <span className="font-medium">
                            ฿{fee.amount.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-0.5">
                          {fee.description}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveFee(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">
                  No additional fees added
                </p>
              )}

              {/* Add fee form */}
              {showAddFee && (
                <div className="space-y-3 bg-gray-50 p-3 rounded-md">
                  <div className="space-y-2">
                    <Label htmlFor="feeType">Fee Type</Label>
                    <Select
                      value={newFee.type}
                      onValueChange={(value) =>
                        setNewFee({
                          ...newFee,
                          type: value as
                            | "housewife"
                            | "fixing"
                            | "internet"
                            | "other",
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select fee type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="housewife">
                          Housewife Service
                        </SelectItem>
                        <SelectItem value="fixing">Fixing Service</SelectItem>
                        <SelectItem value="internet">Internet</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="feeAmount">Amount (฿)</Label>
                      <Input
                        id="feeAmount"
                        type="number"
                        min="0"
                        value={newFee.amount}
                        onChange={(e) =>
                          setNewFee({
                            ...newFee,
                            amount: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="feeDescription">Description</Label>
                      <Input
                        id="feeDescription"
                        value={newFee.description}
                        onChange={(e) =>
                          setNewFee({ ...newFee, description: e.target.value })
                        }
                        placeholder="e.g., Weekly cleaning"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 mt-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAddFee(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="button" size="sm" onClick={handleAddFee}>
                      Add Fee
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-md bg-blue-50 p-3 mt-4 text-xs text-blue-700">
              <div className="flex items-start gap-2">
                <PlusCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">
                    Total Amount: ฿
                    {(
                      Number(newUtility.electric) +
                      Number(newUtility.water) +
                      newUtility.additionalFees.reduce(
                        (sum, fee) => sum + Number(fee.amount),
                        0
                      )
                    ).toLocaleString()}
                  </p>
                  <p className="mt-1">
                    This utility record will be added with "Unpaid" status by
                    default.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddUtility}>
              <Plus className="h-4 w-4 mr-2" />
              Add Utility Record
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isReceiptDialogOpen} onOpenChange={setIsReceiptDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>
              {previewItem &&
              utilityData.find((item) => item.id === previewItem)?.status ===
                "paid"
                ? "Payment Receipt"
                : "Receipt Preview"}
            </DialogTitle>
            <DialogDescription>
              {previewItem &&
              utilityData.find((item) => item.id === previewItem)?.status ===
                "paid"
                ? "Your confirmed payment receipt"
                : "Confirm payment after reviewing"}
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-center p-4">
            <div className="relative w-full h-[500px] border rounded-md overflow-hidden shadow-md">
              {previewItem && (
                <Image
                  src={
                    utilityData.find((item) => item.id === previewItem)
                      ?.imageFile ||
                    "https://www.it.kmitl.ac.th/wp-content/themes/itkmitl2017wp/img/ogimage.png"
                  }
                  alt="Receipt"
                  fill
                  className="object-contain"
                />
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsReceiptDialogOpen(false)}
            >
              Close
            </Button>

            {previewItem &&
              utilityData.find((item) => item.id === previewItem)?.status ===
                "unpaid" && (
                <Button
                  onClick={() => {
                    if (previewItem) {
                      handleConfirmPayment(previewItem);
                      setIsReceiptDialogOpen(false);
                    }
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirm Payment
                </Button>
              )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UtilityPage;
