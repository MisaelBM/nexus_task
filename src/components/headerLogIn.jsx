"use client";

import ButtonQuadroLarge from "./buttons/quadroLarge";
import ButtonCalendarLarge from '../components/buttons/calendarLarge';
import ButtonCronogramaLarge from '../components/buttons/cronoLarge';
import Dashboard from "./buttons/dashboard";
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Header({ isActive = [false, false, false] }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
    }, []);

    return (
        <>
        <div className="header flex items-center justify-between h-fit border-b border-[#374357] bg-[#1F2B3E] p-4">
            <div className="flex items-center gap-8 ml-12">
                <a href="/" className="text-xl font-semibold text-fuchsia-200">Nexus Task</a>
                {isAuthenticated ? (
                    <div className='flex gap-4'>
                        <ButtonCalendarLarge isActive={isActive[0]} />
                        <ButtonQuadroLarge isActive={isActive[1]} />
                        <Dashboard isActive={isActive[2]} />
                    </div>
                ) : (
                    <div className='flex gap-4'>
                        <Link 
                            href="/login" 
                            className="flex items-center px-3 py-2 text-white hover:text-gray-300 transition-colors"
                        >
                            Login
                        </Link>
                        <Link 
                            href="/register" 
                            className="flex items-center px-3 py-2 text-white hover:text-gray-300 transition-colors"
                        >
                            Registrar
                        </Link>
                    </div>
                )}
            </div>
        </div>
        </>
    )
}