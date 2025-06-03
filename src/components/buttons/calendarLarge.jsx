"use client";

import { Calendar } from "lucide-react";

export default function ButtonCalendarLarge() {
    return (
        <>
            <div className="flex items-center text-sm gap-4 p-[6px] rounded-[4px] border border-[#374357] hover:bg-[#374357] cursor-pointer duration-[100ms]">
                <Calendar size={"20px"}/>
                <div className="flex items-center">
                    <span className="">Calendario</span>
                </div>
            </div>
        </>
    )
}