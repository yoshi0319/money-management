import type { Metadata } from "next";
import "../../styles/globals.css";

export const metadata: Metadata = {
    title: "Money Management App",
    description: "無駄遣いをやめたい",
};

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="w-full h-full">
            {children}
        </div>
    );
}
