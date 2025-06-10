"use client";

import { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';

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

    return (
        <div id='sidebar' className='fixed top-0 left-0 z-10 duration-100 h-screen w-12 border-r border-[#374357] bg-[#1F2B3E]'>
            <div onClick={toggleSidebar} className="sidebar-button absolute top-[50%] translate-x-[50%] -translate-y-[50%] bg-[#374357bf] right-0 w-fit h-fit py-3 cursor-pointer rounded-full">
                <ChevronRight id='sidebar-icon' className='duration-100'/>
            </div>
        </div>
    )
}