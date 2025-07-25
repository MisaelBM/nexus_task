"use client";

import { useEffect, useState } from 'react';
import { ChevronRight, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Sidebar({ isOpen, onToggle }) {
    const router = useRouter();
    const [sidebar, setSidebar] = useState(isOpen || false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            setIsAuthenticated(!!token);
        };
        
        checkAuth();
        window.addEventListener('storage', checkAuth);
        
        return () => {
            window.removeEventListener('storage', checkAuth);
        };
    }, []);

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

    const handleLogout = () => {
        // Limpar localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Limpar o cookie
        document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
        
        router.push('/login');
    };

    return (
        <div id='sidebar' className='fixed top-0 left-0 z-[10] duration-100 h-screen w-12 border-r border-[#374357] bg-[#1F2B3E]'>
            <div className="pt-20 flex flex-col gap-2 h-full">
                {isAuthenticated && (
                    <button 
                        onClick={handleLogout}
                        className="flex items-center px-3 py-2 text-red-500 hover:bg-[#374357] mt-auto mb-4"
                    >
                        <LogOut className="w-6 h-6" />
                        {isOpen && <span className="ml-3">Sair</span>}
                    </button>
                )}
            </div>
            <div onClick={toggleSidebar} className="sidebar-button absolute top-[50%] translate-x-[50%] -translate-y-[50%] bg-[#374357bf] right-0 w-fit h-fit py-3 cursor-pointer rounded-full">
                <ChevronRight id='sidebar-icon' className='duration-100'/>
            </div>
        </div>
    )
}