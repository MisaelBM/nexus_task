"use client";

import { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';

export default function Sidebar({ getData, setData }) {
    const [sidebar, setSidebar] = useState(false);
    const [setData2, setSetData2] = useState(setData);

    useEffect(() => {
        console.log(setData)
        let sidebarElement = document.getElementById('sidebar');
        let sidebarButton = document.getElementById('sidebar-button');
        let main = document.getElementById('main');

        if (sidebarElement.id === 'sidebar') {
            if (sidebar) {
                sidebarElement.classList.add('w-64');
                sidebarElement.classList.remove('w-12');
                sidebarButton.classList.add('rotate-180');
            } else {
                sidebarElement.classList.remove('w-64');
                sidebarElement.classList.add('w-12');
                sidebarButton.classList.remove('rotate-180');
            }
            getData(sidebar)
        }
    })

    return (
        <>
            <div id='sidebar' className='absolute top-0 left-0 z-10 duration-100 h-screen w-12 border-r border-[#374357] bg-[#1F2B3E]'>
                <div onClick={() => {setSidebar(!sidebar)}} className="absolute top-100 translate-x-[50%] -translate-y-[50%] bg-[#374357bf] right-0 w-fit h-fit py-3 rounded-full">
                    <ChevronRight id='sidebar-button' className='duration-100'/>
                </div>
            </div>
        </>
    )
}