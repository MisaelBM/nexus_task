"use client";

import { StretchHorizontal } from "lucide-react";

export default function ButtonCronogramaLarge() {
    return (
        <>
            <div className="flex items-center text-sm gap-4 p-[6px] rounded-[4px] border border-[#374357] hover:bg-[#374357] cursor-pointer duration-[100ms]">
            <StretchHorizontal size={"20px"}/>
                <div className="flex items-center">
                    <span className="">Cronograma</span>
                </div>
            </div>
        </>
    )
}