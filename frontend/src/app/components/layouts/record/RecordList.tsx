import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { TabContext } from "../Header/Header";

export default function RecordList() {
    type Record = {
        record_id: number;
        date: string;
        method: string;
        recorded_money: number;
        amount?: number;
        updated_at?: string;
    }
    
    const router = useRouter();
    const {user} = useContext(TabContext);
    const [records, setRecords] = useState<Record[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    router.push('/auth/login');
                    return;
                }
                if (!user) {
                    return;
                }
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/record/?user_id=${user.id}`, {
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
                setRecords(data);
            } catch (e) {
                console.error("データの取得に失敗しました:", e);
            }
        };
        fetchData();
    }, [user, router]);

    const handleAdd = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/auth/login');
                return;
            }
            if (!user) {
                return;
            }

            const newRecord = {
                user_id: user.id,
                date: new Date().toISOString().split('T')[0],
                method: "food",
                recorded_money: 3000,
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/record/?user_id=${user.id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(newRecord),
            });            

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error response:', errorData);
                throw new Error(`データの追加に失敗しました: ${response.status} ${JSON.stringify(errorData)}`);
            }

            const data = await response.json();
            console.log('Success response:', data);

            const updatedResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/record/?user_id=${user.id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });

            if (!updatedResponse.ok) {
                throw new Error("更新後のデータの取得に失敗しました");
            }

            const updatedData = await updatedResponse.json();
            setRecords(updatedData);
        } catch (e) {
            console.error("エラーが発生しました。: ", e);
        }
    };

    return (
        <div className="w-2/3 justify-center items-center border-2 border-gray-300 rounded-md p-4 bg-white">
            <table className="w-full">
                <thead className="border-b border-gray-400">
                    <tr className="text-left">
                        <th className="w-1/5 pb-2">date</th>
                        <th className="w-1/5 pb-2">method</th>
                        <th className="w-1/5 pb-2">in / out</th>
                        <th className="w-1/5 pb-2">amount</th>
                        <th className="w-1/5 pb-2 text-center">
                            <button 
                                className="bg-blue-400 text-white rounded-md px-4 py-1 cursor-pointer hover:bg-blue-300"
                                onClick={handleAdd}
                            >
                                ADD
                            </button>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {records.slice(0, 5).map((record, index) => (
                        <tr key={index} className="border-b border-gray-400">
                            <td className="w-1/5 py-3">{record.date}</td>
                            <td className="w-1/5 py-3">{record.method}</td>
                            <td className="w-1/5 py-3">{record.recorded_money}</td>
                            <td className="w-1/5 py-3">{record.amount}</td>
                            <td className="w-1/5 py-3 text-center">
                                <Image src="/icons/edit.svg" alt="edit" width={20} height={20} className="relative left-1/2 cursor-pointer"/>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}