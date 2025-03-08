"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Calendar,
  Download,
  Search,
  ChevronLeft,
  ChevronRight,
  Clock,
  Receipt,
  FileText,
  Eye,
  Filter,
  CreditCard,
  Upload,
  Check,
  QrCode,
} from "lucide-react";
import Image from "next/image";
import SidebarUser from "@/components/SidebarUser";
import Footer from "@/components/Footer";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Transaction type definition
type Transaction = {
  id: number;
  paidDate: Date;
  forMonth: string;
  totalAmount: number;
  receiptUrl?: string;
  status: "pending" | "paid";
  paymentDate?: Date;
  breakdown?: {
    rent: number;
    water: number;
    electricity: number;
    other?: number;
    service?: number;
    maintenance?: number;
  };
};

// Payment Step type
type PaymentStep = "details" | "payment" | "confirmation";
interface QrPayment {
  base64url: string;
  promptpayid: string;
}
const BillPage = () => {
  const router = useRouter();
  // Sample transaction data
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 1,
      paidDate: new Date(2025, 2, 15), // March 15, 2025
      forMonth: "มีนาคม 2025",
      totalAmount: 5800,
      status: "pending",
      breakdown: {
        rent: 4500,
        water: 300,
        electricity: 800,
        service: 100,
        maintenance: 300,
      },
    },
    {
      id: 2,
      paidDate: new Date(2025, 1, 14), // February 14, 2025
      forMonth: "กุมภาพันธ์ 2025",
      totalAmount: 5650,
      status: "pending",
      breakdown: {
        rent: 4500,
        water: 250,
        electricity: 700,
      },
    },
    {
      id: 3,
      paidDate: new Date(2025, 0, 15), // January 15, 2025
      forMonth: "มกราคม 2025",
      totalAmount: 6100,
      status: "paid",
      paymentDate: new Date(2025, 0, 10),
      receiptUrl: "/receipts/jan2025.pdf",
      breakdown: {
        rent: 4500,
        water: 350,
        electricity: 950,
        other: 100,
      },
    },
    {
      id: 4,
      paidDate: new Date(2024, 11, 15), // December 15, 2024
      forMonth: "ธันวาคม 2024",
      totalAmount: 5900,
      status: "paid",
      paymentDate: new Date(2024, 11, 13),
      receiptUrl: "/receipts/dec2024.pdf",
      breakdown: {
        rent: 4500,
        water: 300,
        electricity: 900,
      },
    },
    {
      id: 5,
      paidDate: new Date(2024, 10, 15), // November 15, 2024
      forMonth: "พฤศจิกายน 2024",
      totalAmount: 5750,
      status: "paid",
      paymentDate: new Date(2024, 10, 14),
      receiptUrl: "/receipts/nov2024.pdf",
      breakdown: {
        rent: 4500,
        water: 250,
        electricity: 800,
      },
    },
    {
      id: 6,
      paidDate: new Date(2024, 9, 14), // October 14, 2024
      forMonth: "ตุลาคม 2024",
      totalAmount: 5850,
      status: "paid",
      paymentDate: new Date(2024, 9, 12),
      receiptUrl: "/receipts/oct2024.pdf",
      breakdown: {
        rent: 4500,
        water: 300,
        electricity: 850,
      },
    },
  ]);
  useEffect(() => {
    fetch("http://localhost:3000/bills", {
      method: "GET",
      credentials: "include",
    })
      .then((val) => {
        if (val.status == 403) return router.push("/login");
        return val.json();
      })
      .then((data) => {
        const transformedBills = data.map((billData: any) => {
          // Format dates
          const paidDate = new Date(billData.DueDate); // Convert DueDate into paidDate
          const forMonth = paidDate.toLocaleString("th-TH", {
            month: "long",
            year: "numeric",
          }); // Format month (e.g. "ตุลาคม 2024")

          // Calculate the total amount (assuming roomprice + waterprice + electricprice + taskprice)
          const totalAmount =
            parseFloat(billData.roomprice) +
            parseFloat(billData.waterprice) +
            parseFloat(billData.electricprice) +
            parseFloat(billData.taskprice);

          // Map bill status (assuming 0 means 'paid' and other statuses map to 'unpaid')
          const status = billData.billStatus === 0 ? "pending" : "paid";

          // Breakdown object
          const breakdown = {
            rent: parseFloat(billData.roomprice),
            water: parseFloat(billData.waterprice),
            electricity: parseFloat(billData.electricprice),
          };
          console.log(billData.billStatus);
          // Construct final response
          return {
            id: billData.BillID, // Use BillID as the ID
            paidDate, // Use the formatted date
            forMonth, // The month formatted in Thai
            totalAmount: totalAmount.toFixed(2), // Total amount rounded to 2 decimal places
            status,
            paymentDate: new Date(billData.paidDate), // Use the same paidDate for paymentDate (or modify if needed)
            receiptUrl:
              billData.billStatus !== 0 &&
              billData.transactionimg, // Example URL for the receipt
            breakdown,
          };
        });
        setTransactions(transformedBills);
      });
  }, []);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [paymentStep, setPaymentStep] = useState<PaymentStep>("details");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [paymentFile, setPaymentFile] = useState<File | null>(null);
  const [qr, setQr] = useState<QrPayment | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    console.log("SDSDSD");
    if (paymentStep !== "payment") return;
    fetch(`http://localhost:3000/bills/${selectedTransaction?.id}/qr`, {
      method: "GET",
      credentials: "include",
    })
      .then((v) => v.json())
      .then((data) => {
        setQr({
          base64url: data.base64url,
          promptpayid: data.promptpayid,
        } as QrPayment);
      })
      .catch((ex) => {});
  }, [paymentStep]);
  // Filter transactions based on search term
  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.forMonth.toLowerCase().includes(searchTerm.toLowerCase()) ||
      format(transaction.paidDate, "dd/MM/yyyy").includes(searchTerm)
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = filteredTransactions.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Handle page changes
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));

  // View transaction details
  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setPaymentStep("details");

    // If the transaction is already paid, skip to confirmation
    if (transaction.status === "paid") {
      setPaymentStep("confirmation");
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPaymentFile(e.target.files[0]);
    }
  };

  // Handle payment confirmation
  const handleConfirmPayment = () => {
    if (selectedTransaction) {
      if (paymentFile) {
        const formdata = new FormData();
        formdata.append(
          "TransactionImg",
          new Blob([paymentFile], { type: paymentFile.type })
        );
        fetch(`http://localhost:3000/bills/${selectedTransaction.id}/paying`, {
          method: "PUT",
          body: formdata,
          credentials: "include",
        })
          .then((val) => {
            if (!val.ok) {
              console.error("Not okay");
            }
          })
          .catch((ex) => {
            console.error(ex);
          });
      }
      // Update the transaction status
      const updatedTransactions = transactions.map((transaction) =>
        transaction.id === selectedTransaction.id
          ? ({
              ...transaction,
              status: "paid",
              paidDate: new Date(),
              receiptUrl: paymentFile
                ? URL.createObjectURL(paymentFile)
                : undefined,
            } as Transaction)
          : transaction
      );

      setTransactions(updatedTransactions);
      toast.success("การชำระเงินสำเร็จ", {
        description: `ชำระเงินค่าเช่าเดือน ${selectedTransaction.forMonth} เรียบร้อยแล้ว`,
      });

      // Reset payment state
      setPaymentFile(null);
      setPaymentStep("confirmation");

      // Update the selected transaction for the UI
      const updatedTransaction = updatedTransactions.find(
        (t) => t.id === selectedTransaction.id
      );
      if (updatedTransaction) {
        setSelectedTransaction(updatedTransaction);
      }
    }
  };

  // Reset dialog state when closed
  const handleDialogClose = () => {
    if (!isDialogOpen) {
      setTimeout(() => {
        setPaymentStep("details");
        setPaymentFile(null);
      }, 200);
    }
  };

  // Generate unique payment reference
  const getPaymentReference = (transaction: Transaction) => {
    return `DORM${transaction.id}${transaction.paidDate.getFullYear()}${(
      transaction.paidDate.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex flex-1">
        <SidebarUser />

        <main className="flex-1 p-6 pt-16 md:pt-6 overflow-auto">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0 flex items-center">
                <Receipt className="w-6 h-6 mr-2 text-primary" />
                จ่ายค่าเช่า
              </h1>
              <div className="flex gap-3">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="text"
                    placeholder="ค้นหาตามเดือนหรือวันที่..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 w-full"
                  />
                </div>
              </div>
            </div>

            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">
                  รายการที่ต้องชำระเงินทั้งหมด
                </CardTitle>
                <CardDescription>
                  ตรวจสอบการจ่ายค่าค่าใช้จ่ายรายเดือนที่ต้องจ่าย
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
                          จ่ายภายในวันที่
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          สำหรับเดือน
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          จำนวนเงิน
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          สถานะ
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ดำเนินการ
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentTransactions.map((transaction) => (
                        <tr
                          key={transaction.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                              {format(transaction.paidDate, "d MMMM yyyy", {
                                locale: th,
                              })}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {transaction.forMonth}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {formatCurrency(transaction.totalAmount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge
                              variant="outline"
                              className={
                                transaction.status === "paid"
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : "bg-yellow-50 text-yellow-700 border-yellow-200"
                              }
                            >
                              {transaction.status === "paid"
                                ? "จ่ายแล้ว"
                                : "รอชำระ"}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                            <Dialog
                              open={
                                isDialogOpen &&
                                selectedTransaction?.id === transaction.id
                              }
                              onOpenChange={(open) => {
                                setIsDialogOpen(open);
                                handleDialogClose();
                              }}
                            >
                              <DialogTrigger asChild>
                                <Button
                                  variant={
                                    transaction.status === "paid"
                                      ? "outline"
                                      : "ghost"
                                  }
                                  size="sm"
                                  className={
                                    transaction.status === "paid"
                                      ? "text-green-600 hover:text-green-700 hover:bg-green-50"
                                      : "text-primary hover:text-primary-dark hover:bg-primary/10"
                                  }
                                  onClick={() => handleViewDetails(transaction)}
                                >
                                  {transaction.status === "paid" ? (
                                    <>
                                      <Eye className="h-4 w-4 mr-1" />
                                      ดูรายละเอียด
                                    </>
                                  ) : (
                                    <>
                                      <CreditCard className="h-4 w-4 mr-1" />
                                      จ่ายเงิน
                                    </>
                                  )}
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-md">
                                {/* Step 1: Transaction Details */}
                                {paymentStep === "details" && (
                                  <>
                                    <DialogHeader>
                                      <DialogTitle>
                                        รายละเอียดการชำระเงิน
                                      </DialogTitle>
                                      <DialogDescription>
                                        ค่าเช่าและค่าสาธารณูปโภคสำหรับเดือน{" "}
                                        {selectedTransaction?.forMonth}
                                      </DialogDescription>
                                    </DialogHeader>

                                    <div className="space-y-4 py-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <p className="text-sm text-gray-500">
                                            วันสุดท้ายในการชำระ
                                          </p>
                                          <p className="font-medium">
                                            {selectedTransaction &&
                                              format(
                                                selectedTransaction.paidDate,
                                                "d MMMM yyyy",
                                                { locale: th }
                                              )}
                                          </p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-gray-500">
                                            สำหรับเดือน
                                          </p>
                                          <p className="font-medium">
                                            {selectedTransaction?.forMonth}
                                          </p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-gray-500">
                                            ยอดรวมทั้งหมด
                                          </p>
                                          <p className="font-medium text-lg text-primary">
                                            {selectedTransaction &&
                                              formatCurrency(
                                                selectedTransaction.totalAmount
                                              )}
                                          </p>
                                        </div>
                                      </div>

                                      {selectedTransaction?.breakdown && (
                                        <div className="border rounded-md p-4 bg-gray-50 mt-4">
                                          <h3 className="font-medium mb-3">
                                            รายละเอียดค่าใช้จ่าย
                                          </h3>
                                          <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                              <span>ค่าเช่า</span>
                                              <span>
                                                {formatCurrency(
                                                  selectedTransaction.breakdown
                                                    .rent
                                                )}
                                              </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                              <span>ค่าน้ำ</span>
                                              <span>
                                                {formatCurrency(
                                                  selectedTransaction.breakdown
                                                    .water
                                                )}
                                              </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                              <span>ค่าไฟ</span>
                                              <span>
                                                {formatCurrency(
                                                  selectedTransaction.breakdown
                                                    .electricity
                                                )}
                                              </span>
                                            </div>
                                            {selectedTransaction.breakdown
                                              .service && (
                                              <div className="flex justify-between items-center">
                                                <span>ค่าแม่บ้าน</span>
                                                <span>
                                                  {formatCurrency(
                                                    selectedTransaction
                                                      .breakdown.service
                                                  )}
                                                </span>
                                              </div>
                                            )}
                                            {selectedTransaction.breakdown
                                              .maintenance && (
                                              <div className="flex justify-between items-center">
                                                <span>ค่าช่าง</span>
                                                <span>
                                                  {formatCurrency(
                                                    selectedTransaction
                                                      .breakdown.maintenance
                                                  )}
                                                </span>
                                              </div>
                                            )}
                                            {selectedTransaction.breakdown
                                              .other && (
                                              <div className="flex justify-between items-center">
                                                <span>อื่นๆ</span>
                                                <span>
                                                  {formatCurrency(
                                                    selectedTransaction
                                                      .breakdown.other
                                                  )}
                                                </span>
                                              </div>
                                            )}
                                            <div className="border-t pt-2 mt-2 flex justify-between items-center font-medium">
                                              <span>รวมทั้งหมด</span>
                                              <span>
                                                {formatCurrency(
                                                  selectedTransaction.totalAmount
                                                )}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>

                                    <DialogFooter className="flex justify-between">
                                      <Button
                                        variant="outline"
                                        onClick={() => setIsDialogOpen(false)}
                                      >
                                        ปิด
                                      </Button>
                                      {selectedTransaction?.status ===
                                        "pending" && (
                                        <Button
                                          onClick={() =>
                                            setPaymentStep("payment")
                                          }
                                        >
                                          ดำเนินการชำระเงิน
                                        </Button>
                                      )}
                                    </DialogFooter>
                                  </>
                                )}

                                {/* Step 2: Payment with QR Code */}
                                {paymentStep === "payment" &&
                                  selectedTransaction && (
                                    <>
                                      <DialogHeader>
                                        <DialogTitle>
                                          ชำระเงินผ่าน PromptPay QR Code
                                        </DialogTitle>
                                        <DialogDescription>
                                          สแกน QR Code ด้วยแอพธนาคารของท่าน
                                        </DialogDescription>
                                      </DialogHeader>

                                      <div className="space-y-6 py-4">
                                        <div className="text-center">
                                          <div className="mx-auto w-48 h-48 bg-white p-2 border rounded-md mb-3 flex items-center justify-center">
                                            <Image
                                              src={qr?.base64url ? qr.base64url : "/api/200/200"}
                                              width={200}
                                              height={200}
                                              alt="PromptPay QR Code"
                                              className="w-full h-full"
                                            />
                                            {/* In real implementation, replace with actual QR Code */}
                                          </div>
                                          <p className="text-sm text-gray-500 mb-1">
                                            ยอดเงินที่ต้องชำระ
                                          </p>
                                          <p className="font-medium text-lg text-primary mb-2">
                                            {formatCurrency(
                                              selectedTransaction.totalAmount
                                            )}
                                          </p>
                                          <p className="text-sm text-gray-500 mb-1">
                                            อ้างอิง
                                          </p>
                                          <p className="text-sm font-mono font-medium mb-6">
                                            {qr?.promptpayid || getPaymentReference(selectedTransaction)}
                                          </p>
                                        </div>

                                        <div className="space-y-3">
                                          <p className="text-sm font-medium">
                                            แนบสลิปการโอนเงิน
                                          </p>
                                          <div className="border-2 border-dashed rounded-md p-4 text-center">
                                            <input
                                              type="file"
                                              ref={fileInputRef}
                                              onChange={handleFileChange}
                                              className="hidden"
                                              accept="image/*,.pdf"
                                            />

                                            {!paymentFile ? (
                                              <div className="py-3">
                                                <Upload className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                                                <p className="text-sm text-gray-500">
                                                  ลากไฟล์หรือ{" "}
                                                  <button
                                                    className="text-primary hover:text-primary-dark"
                                                    onClick={() =>
                                                      fileInputRef.current?.click()
                                                    }
                                                  >
                                                    เลือกไฟล์
                                                  </button>
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                  รองรับไฟล์ JPG, PNG, หรือ PDF
                                                </p>
                                              </div>
                                            ) : (
                                              <div className="py-3">
                                                <Check className="h-8 w-8 text-green-500 mx-auto mb-2" />
                                                <p className="text-sm text-gray-700 font-medium">
                                                  {paymentFile.name}
                                                </p>
                                                <button
                                                  className="text-xs text-primary hover:text-primary-dark mt-1"
                                                  onClick={() =>
                                                    fileInputRef.current?.click()
                                                  }
                                                >
                                                  เปลี่ยนไฟล์
                                                </button>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>

                                      <DialogFooter className="flex justify-between">
                                        <Button
                                          variant="outline"
                                          onClick={() =>
                                            setPaymentStep("details")
                                          }
                                        >
                                          ย้อนกลับ
                                        </Button>
                                        <Button
                                          onClick={handleConfirmPayment}
                                          disabled={!paymentFile}
                                        >
                                          ยืนยันการชำระเงิน
                                        </Button>
                                      </DialogFooter>
                                    </>
                                  )}

                                {/* Step 3: Confirmation */}
                                {paymentStep === "confirmation" &&
                                  selectedTransaction && (
                                    <>
                                      <DialogHeader>
                                        <DialogTitle>
                                          รายละเอียดการชำระเงิน
                                        </DialogTitle>
                                        <DialogDescription>
                                          ค่าเช่าและค่าสาธารณูปโภคสำหรับเดือน{" "}
                                          {selectedTransaction.forMonth}
                                        </DialogDescription>
                                      </DialogHeader>

                                      <div className="space-y-4 py-4">
                                        <div className="rounded-md bg-green-50 p-4 flex items-center gap-3">
                                          <Check className="h-5 w-5 text-green-500" />
                                          <div>
                                            <p className="font-medium text-green-800">
                                              ชำระเงินสำเร็จ
                                            </p>
                                            <p className="text-sm text-green-700">
                                              ชำระเมื่อ{" "}
                                              {selectedTransaction.paymentDate
                                                ? format(
                                                    selectedTransaction.paymentDate,
                                                    "d MMMM yyyy",
                                                    { locale: th }
                                                  )
                                                : format(
                                                    new Date(),
                                                    "d MMMM yyyy",
                                                    { locale: th }
                                                  )}
                                            </p>
                                          </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                          <div>
                                            <p className="text-sm text-gray-500">
                                              สำหรับเดือน
                                            </p>
                                            <p className="font-medium">
                                              {selectedTransaction.forMonth}
                                            </p>
                                          </div>
                                          <div>
                                            <p className="text-sm text-gray-500">
                                              ยอดรวมทั้งหมด
                                            </p>
                                            <p className="font-medium text-lg">
                                              {formatCurrency(
                                                selectedTransaction.totalAmount
                                              )}
                                            </p>
                                          </div>
                                        </div>

                                        {selectedTransaction.receiptUrl && (
                                          <div className="border rounded-md p-4 bg-gray-50">
                                            <h3 className="font-medium mb-3">
                                              สลิปการชำระเงิน
                                            </h3>
                                            <div className="aspect-video bg-gray-200 rounded-md overflow-hidden">
                                              {/* Display uploaded receipt image */}
                                              <Image
                                                src={
                                                  selectedTransaction.receiptUrl
                                                }
                                                alt="Payment receipt"
                                                width={500}
                                                height={300}
                                                className="w-full h-full object-contain"
                                              />
                                            </div>
                                            <div className="flex justify-end mt-3">
                                              <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-primary"
                                              >
                                                <Download className="h-4 w-4 mr-1" />
                                                ดาวน์โหลดสลิป
                                              </Button>
                                            </div>
                                          </div>
                                        )}
                                      </div>

                                      <DialogFooter>
                                        <Button
                                          onClick={() => setIsDialogOpen(false)}
                                        >
                                          ปิด
                                        </Button>
                                      </DialogFooter>
                                    </>
                                  )}
                              </DialogContent>
                            </Dialog>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Empty state */}
                {currentTransactions.length === 0 && (
                  <div className="px-6 py-10 text-center text-gray-500">
                    <FileText className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                    <p>ไม่พบรายการชำระเงิน</p>
                    <p className="text-sm">
                      ลองค้นหาด้วยคำอื่น หรือดูรายการที่มีอยู่ทั้งหมด
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex items-center justify-between py-4 border-t">
                <div className="text-sm text-gray-500">
                  แสดง {indexOfFirstItem + 1}-
                  {Math.min(indexOfLastItem, filteredTransactions.length)} จาก{" "}
                  {filteredTransactions.length} รายการ
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pageNumber) => (
                      <Button
                        key={pageNumber}
                        variant={
                          pageNumber === currentPage ? "default" : "outline"
                        }
                        size="sm"
                        className="w-8 h-8 p-0"
                        onClick={() => paginate(pageNumber)}
                      >
                        {pageNumber}
                      </Button>
                    )
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default BillPage;
