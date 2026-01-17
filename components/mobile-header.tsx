"use client";

import { MobileSidebar } from "./mobile-sidebar";

export const MobileHeader = () => {
    return (
        <nav className="lg:hidden px-4 h-[50px] flex items-center bg-white border-b border-gray-200 fixed top-0 w-full z-50 shadow-sm">
            <MobileSidebar />
        </nav>
    );
} 

