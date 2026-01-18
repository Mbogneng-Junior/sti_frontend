"use client";

import { MobileHeader } from "@/components/mobile-header";
import { Sidebar } from "@/components/sidebar";
import { usePathname } from "next/navigation";

type Props = {
    children: React.ReactNode;
};


const MainLayout = ({
    children
}: Props) => {
    const pathname = usePathname();
    const isExpertRoute = pathname?.startsWith('/expert');
    const isAdminRoute = pathname?.startsWith('/admin');
    const isLearnRoute = pathname?.startsWith('/learn');
    const isProfilingRoute = pathname?.startsWith('/profiling');

    // Pour les routes expert, on ne rend que les children (pas de sidebar Tuteur5GI)
    if (isExpertRoute) {
        return <>{children}</>;
    }

    // Pour les routes admin, on ne rend que les children (AdminLayout gere la sidebar)
    if (isAdminRoute) {
        return <>{children}</>;
    }

    // Pour les routes profiling, on ne rend que les children (page autonome)
    if (isProfilingRoute) {
        return <>{children}</>;
    }

    // Pour les routes learn, on ne rend que les children (LearnLayout gère la sidebar)
    if (isLearnRoute) {
        return <>{children}</>;
    }

    return (
        <>
            <MobileHeader />
            <Sidebar className="hidden lg:flex" />
            <main className="lg:pl-64 h-full pt-[50px] lg:pt-0 flex-1">
                <div className="max-w-[1056px] mx-auto pt-6 h-full">
                { children}
                </div>
            </main>
        </>
    );
};

export default MainLayout;