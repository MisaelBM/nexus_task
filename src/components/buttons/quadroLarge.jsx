"use client";

export default function ButtonQuadroLarge() {
    return (
        <>
            <div className="flex items-center text-sm gap-4 p-[6px] rounded-[4px] border border-[#374357] hover:bg-[#374357] cursor-pointer duration-[100ms]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#ffffff" viewBox="0 0 256 256"><path d="M224,40a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,40ZM208,80v96a16,16,0,0,1-16,16H152a16,16,0,0,1-16-16V80a16,16,0,0,1,16-16h40A16,16,0,0,1,208,80Zm-16,0H152v96h40Zm-72,0V216a16,16,0,0,1-16,16H64a16,16,0,0,1-16-16V80A16,16,0,0,1,64,64h40A16,16,0,0,1,120,80Zm-16,0H64V216h40Z"></path></svg>
                <div className="flex items-center">
                    <span className="">Quadro</span>
                </div>
            </div>
        </>
    )
}