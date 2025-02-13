
export default function Navbar() {
return (
    <nav className="flex justify-between items-center p-4 shadow-md bg-white font-bold">
        <div className="text-purple-600 text-xl">
            Dormitory
        </div>
        <div className="flex space-x-6">
            <a href="#" className="text-gray-600 hover:text-gray-800">หน้าแรก</a>
            <a href="#" className="text-gray-600 hover:text-gray-800">ข้อมูลหอพัก</a>
            <a href="#" className="text-gray-600 hover:text-gray-800">จองห้อง</a>
            <a href="#" className="text-gray-600 hover:text-gray-800">คู่มือการใช้งาน</a>
        </div>
    </nav>
    );
}
