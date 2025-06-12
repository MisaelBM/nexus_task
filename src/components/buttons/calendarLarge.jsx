"use client";

import { Calendar } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function ButtonCalendarLarge({ isActive }) {
    return (
        <>
        <Link href="/pages/calendar" className={`flex items-center text-sm gap-4 p-[6px] rounded-[4px] border border-[#374357] ${isActive === true ? 'bg-[#374357] hover:bg-[#374357]' : 'hover:bg-[#374357]'} cursor-pointer duration-[100ms]`}>
            <Calendar size={"20px"}/>
            <div className="flex items-center">
                <span className="">Calendario</span>
            </div>
        </Link>
        </>
    )
}