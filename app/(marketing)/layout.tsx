"use client";

import { Header } from "./header";
import { usePathname } from "next/navigation";

type Props = {
    children: React.ReactNode;
};


const MarketingLayout = ({ children }: Props) => {
    const pathname = usePathname();
    const isExpertRoute = pathname?.startsWith('/expert');
    const isProfilingRoute = pathname?.startsWith('/profiling');
    const isHomePage = pathname === '/';

    // Pour les routes expert, on ne rend que les children (pas de Header)
    if (isExpertRoute) {
        return <>{children}</>;
    }

    // Pour les routes profiling, on ne rend que les children (page autonome)
    if (isProfilingRoute) {
        return <>{children}</>;
    }

    // Pour la page d'accueil, on ne rend que les children (design intégré)
    if (isHomePage) {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 flex flex-col items-center justify-center">
                {children}
            </main>
        </div>
    );
};

export default MarketingLayout;