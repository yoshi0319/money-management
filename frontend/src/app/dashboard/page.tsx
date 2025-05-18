'use client'

import { useEffect, useState } from "react";

export default function Dashboard() {
    type User = {
        id: number,
        first_name: string,
        family_name: string,
        user_name: string,
        email_address: string,
        created_at: string
    }

    const [user, setUser] = useState<User>();

    useEffect(() => {
        const fetchData = async () => {
            try {    
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/17`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem('token')}`
                    },
                })
                const data = await response.json();
                if(!response.ok) {
                    throw new Error("Failed to fetch data")
                }
                setUser(data);
            } catch (e) {
                console.log("erroe", e);
            }
            
        }
        fetchData();
    }, [])

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <p>dashboard</p>
            <p>{user?.first_name}</p>
            <p>{user?.family_name}</p>
        </div>
    );
}