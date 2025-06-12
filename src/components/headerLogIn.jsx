"use client";

import ButtonQuadroLarge from "./buttons/quadroLarge";
import ButtonCalendarLarge from '../components/buttons/calendarLarge';
import ButtonCronogramaLarge from '../components/buttons/cronoLarge';

export default function Header({ isActive = [false, false, false] }) {
    return (
        <>
        <div className="header flex items-center h-fit border-b border-[#374357] bg-[#1F2B3E] p-4">
            <div className="flex items-center gap-8 ml-12">
                <h1 className="text-xl font-semibold text-fuchsia-200">Nexus Task</h1>
                <div className='flex gap-4'>
                    <ButtonCalendarLarge isActive={isActive[0]} />
                    <ButtonQuadroLarge isActive={isActive[1]} />
                    <ButtonCronogramaLarge isActive={isActive[2]} />
                </div>
            </div>
        </div>
        </>
    )
}