"use client";

import { useEffect, useState } from 'react';
import { ChevronRight, LayoutDashboard, CalendarDays, Kanban } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar({ isOpen, onToggle }) {
    
    const [sidebar, setSidebar] = useState(isOpen || false);

    useEffect(() => {
        setSidebar(isOpen);
        const sidebarElement = document.getElementById('sidebar');
        const sidebarIcon = document.getElementById('sidebar-icon');

        if (sidebarElement) {
            if (isOpen) {
                sidebarElement.classList.add('w-64');
                sidebarElement.classList.remove('w-12');
                sidebarIcon?.classList.add('rotate-180');
            } else {
                sidebarElement.classList.remove('w-64');
                sidebarElement.classList.add('w-12');
                sidebarIcon?.classList.remove('rotate-180');
            }
        }
    }, [isOpen]);

    const toggleSidebar = () => {
        const newSidebarState = !sidebar;
        setSidebar(newSidebarState);
        if (onToggle) onToggle(newSidebarState);
    }

    const pathname = usePathname();

    return (
        <div id='sidebar' className='fixed top-0 left-0 z-10 duration-100 h-screen w-12 border-r border-[#374357] bg-[#1F2B3E]'>
            <div className="pt-20 flex flex-col gap-2">
                <Link href="/pages/dashboard" className={`flex items-center px-3 py-2 ${pathname === '/pages/dashboard' ? 'bg-[#374357]' : 'hover:bg-[#374357]'}`}>
                    <LayoutDashboard className="w-6 h-6" />
                    {isOpen && <span className="ml-3">Dashboard</span>}
                </Link>
                <Link href="/pages/frame" className={`flex items-center px-3 py-2 ${pathname === '/pages/frame' ? 'bg-[#374357]' : 'hover:bg-[#374357]'}`}>
                    <Kanban className="w-6 h-6" />
                    {isOpen && <span className="ml-3">Quadro</span>}
                </Link>
                <Link href="/pages/calendar" className={`flex items-center px-3 py-2 ${pathname === '/pages/calendar' ? 'bg-[#374357]' : 'hover:bg-[#374357]'}`}>
                    <CalendarDays className="w-6 h-6" />
                    {isOpen && <span className="ml-3">Calendário</span>}
                </Link>
            </div>
            <div onClick={toggleSidebar} className="sidebar-button absolute top-[50%] translate-x-[50%] -translate-y-[50%] bg-[#374357bf] right-0 w-fit h-fit py-3 cursor-pointer rounded-full">
                <ChevronRight id='sidebar-icon' className='duration-100'/>
            </div>
        </div>
    )
}