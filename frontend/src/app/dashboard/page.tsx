'use client'

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header, { TabContext } from "../components/layouts/Header/Header";
import { jwtDecode } from "jwt-decode";

type User = {
    id: number,
    first_name: string,
    family_name: string,
    user_name: string,
    email_address: string,
    created_at: string
}

type JwtPayload = {
    token_type: string;
    exp: number;
    iat: number;
    jti: string;
    user_id: number;
}

export default function Dashboard() {
    const router = useRouter();
    const [tabIndex, setTabIndex] = useState(0);
    const [user, setUser] = useState<User>();
    const [dataVersion, setDataVersion] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {    
                const token = localStorage.getItem('token');
                if (!token) {
                    router.push('/auth/login');
                    return;
                }

                const decodedToken = jwtDecode<JwtPayload>(token);
                const userId = decodedToken.user_id;
                
                if (!userId) {
                    console.error('ユーザーIDが見つかりませんでした');
                    router.push('/auth/login');
                    return;
                }

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/${userId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                });
                if (!response.ok) {
                    throw new Error("データの取得に失敗しました");
                }
                const data = await response.json();
                setUser(data);
            } catch (e) {
                console.error("エラーが発生しました:", e);
                router.push('/auth/login');
            }
        };
        fetchData();
    }, [router]);

    return (
        <TabContext.Provider value={{ tabIndex, setTabIndex, user, setUser, dataVersion, setDataVersion }}>
            <div className="flex flex-col min-h-screen">
                <Header />
            </div>
        </TabContext.Provider>
    );
}
