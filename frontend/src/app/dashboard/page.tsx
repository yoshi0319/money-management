'use client'

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header, { TabContext } from "../components/layouts/Header/Header";

type User = {
    id: number,
    first_name: string,
    family_name: string,
    user_name: string,
    email_address: string,
    created_at: string
}

export default function Dashboard() {
    const router = useRouter();
    const [tabIndex, setTabIndex] = useState(0);
    const [user, setUser] = useState<User>();

    useEffect(() => {
        const fetchData = async () => {
            try {    
                const token = localStorage.getItem('token');
                if (!token) {
                    router.push('/login');
                    return;
                }
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/17`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                const data = await response.json();
                setUser(data);
            } catch (e) {
                console.error("Error fetching user data:", e);
                router.push('/login');
            }
        };
        fetchData();
    }, [router]);

    return (
        <TabContext.Provider value={{ tabIndex, setTabIndex, user, setUser }}>
            <div className="flex flex-col items-center justify-center min-h-screen">
                <Header />
                <div className="flex flex-col items-center justify-center flex-1 w-full">
                    <p>dashboard</p>
                </div>
            </div>
        </TabContext.Provider>
    );
}