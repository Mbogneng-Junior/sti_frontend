"use client";

import { MobileHeader } from "@/components/mobile-header";
import { Sidebar } from "@/components/sidebar";

type Props = {
    children: React.ReactNode;
};

const LearnLayout = ({ children }: Props) => {
    return (
        <div className="min-h-screen bg-gray-50">
            <MobileHeader />
            <Sidebar className="hidden lg:flex" />
            <main className="lg:pl-64 min-h-screen pt-[50px] lg:pt-0">
                {children}
            </main>
        </div>
    );
};

export default LearnLayout;
