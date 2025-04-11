import type { Metadata } from "next";
import "../styles/globals.css"

export const metadata: Metadata = {
        title: "Money Management App",
    description: "無駄遣いをやめたい",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
    <html lang="ja" className="w-full h-full overflow-hidden">
        <body>
        {children}
        </body>
    </html>
    );
}
