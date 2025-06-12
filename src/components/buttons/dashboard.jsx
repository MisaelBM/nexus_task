"use client";

import { LayoutDashboard } from 'lucide-react';
import Link from "next/link";

export default function Dashboard({ isActive }) {
    return (
        <>
            <Link href="/pages/dashboard" className={`flex items-center text-sm gap-4 p-[6px] rounded-[4px] border ${isActive === true ? 'bg-[#374357] hover:bg-[#374357]' : 'hover:bg-[#374357]'} border-[#374357] cursor-pointer duration-[100ms]`}>
                <LayoutDashboard className="w-6 h-6" />
                <span className="ml-3">Dashboard</span>
            </Link>
        </>
    )
}