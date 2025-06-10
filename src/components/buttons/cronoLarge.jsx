"use client";

import { StretchHorizontal } from "lucide-react";
import Link from "next/link";

export default function ButtonCronogramaLarge({ isActive }) {
    return (
        <>
        <Link href="#" className={`flex items-center text-sm gap-4 p-[6px] rounded-[4px] border ${isActive === true ? 'bg-[#374357] hover:bg-[#374357]' : 'hover:bg-[#374357]'} border-[#374357] cursor-pointer duration-[100ms]`}>
            <StretchHorizontal size={"20px"}/>
            <div className="flex items-center">
                <span className="">Cronograma</span>
            </div>
        </Link>
        </>
    )
}