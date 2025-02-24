import React from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { usePathname } from 'next/navigation';
import {
  School,
  Home,
  Users2,
  BookOpen,
  Calendar,
  Settings,
  Layout,
  Building2,
  GraduationCap,
  Wifi,
  HelpCircle
} from "lucide-react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
  const pathname = usePathname();
  const menuItems = [
    {
      title: "หน้าผู้ใช้",
      icon: Home,
      href: "/admin/main"
    },
    {
      title: "หน้าหลัก",
      icon: School,
      href: "/faculty"
    },
    {
      title: "เลือกห้อง",
      icon: Building2,
      href: "/floors",
      submenu: [
        { title: "Mezzanine (M)", href: "/floors/m" },
        { title: "2nd Floor", href: "/floors/2" },
        { title: "3rd Floor", href: "/floors/3" },
        { title: "4th Floor", href: "/floors/4" },
        { title: "5th Floor", href: "/floors/5" },
        { title: "6th Floor", href: "/floors/6" }
      ]
    },
    {
      title: "เรียกแม่บ้าน",
      icon: Users2,
      href: "/staff"
    },
    {
      title: "บันทึกค่าสาธารณูปโภค",
      icon: BookOpen,
      href: "/courses"
    }
  ];

  const [openSubmenu, setOpenSubmenu] = React.useState<string | null>(null);

  const isActive = (href: string) => {
    if (href === '/dashboard' && pathname === '/') return true; // Default page
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <div className={cn("relative min-h-screen w-72 bg-background border-r pb-32", className)}>
      <div className='h-screen flex flex-col justify-between pb-4'>
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <div className="flex flex-col items-start px-3 my-8">
              {/* <School className="h-6 w-6 text-primary" /> */}
              <h2 className="text-3xl font-semibold text-primary  leading-[10px]">Dormitory</h2>
              <h2 className="text-3xl font-semibold  leading-[40px]">Manager</h2>
            </div>
            <div className="space-y-2">
              {menuItems.map((item) => (
                <div key={item.title}>
                  <Button
                    variant={isActive(item.href) || openSubmenu === item.title ? "primary" : "ghost"}
                    className="w-full justify-start text-[18px] py-6"
                    onClick={() => {
                      if (item.submenu) {
                        setOpenSubmenu(openSubmenu === item.title ? null : item.title);
                      }
                    }}
                  >
                    <item.icon className="mr-2 h-10 w-10" />
                    {item.title}
                  </Button>
                  {item.submenu && openSubmenu === item.title && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.submenu.map((subItem) => (
                        <Button
                          key={subItem.title}
                          variant={isActive(subItem.href) ? "primary" : "ghost"}
                          className="w-full justify-start pl-6"
                        >
                          {subItem.title}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="self-end px-3 w-full">
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start text-[18px] py-6">
              <Settings className="mr-2 h-8 w-8" />
              Settings
            </Button>
            <Button variant="ghost" className="w-full justify-start text-[18px] py-6">
              <HelpCircle className="mr-2 h-8 w-8" />
              Help & Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;