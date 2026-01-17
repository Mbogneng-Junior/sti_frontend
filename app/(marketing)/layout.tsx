"use client";

import { Footer } from "./footer";
import { Header } from "./header";
import { usePathname } from "next/navigation";

type Props = {
    children: React.ReactNode;
};


const MarketingLayout = ({ children }: Props) => {
    const pathname = usePathname();
    const isExpertRoute = pathname?.startsWith('/expert');
    const isLearnRoute = pathname?.startsWith('/learn');

    // Pour les routes expert, on ne rend que les children (pas de Header Tuteur5GI)
    if (isExpertRoute) {
        return <>{children}</>;
    }

    // Pour les routes learn, on ne rend que les children (elles ont leur propre layout)
    if (isLearnRoute) {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 flex flex-col items-center justify-center">
                {children}
            </main>
            <Footer />

        </div>
    );
};

export default MarketingLayout;