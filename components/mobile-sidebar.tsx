"use client";

import {
    Sheet,
    SheetContent,
    SheetTrigger
} from "@/components/ui/sheet";

import { Sidebar } from "@/components/sidebar";
import { Menu } from "lucide-react";


export const MobileSidebar = () => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Menu className="h-6 w-6 text-white cursor-pointer" />
            </SheetTrigger>
            <SheetContent side="left" className="p-0 z-100">
                <Sidebar />
            </SheetContent>
        </Sheet>

    );
}