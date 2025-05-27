'use client';

import dynamic from 'next/dynamic';
import { useEffect, useContext, useState } from 'react';
import { Cell, Legend, Pie, PieChart, Tooltip, Text } from "recharts";
import { TabContext } from '../Header/Header';
import { useRouter } from 'next/navigation';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Image from "next/image";

type GraphProps = {
    dateRange?: [Date | null, Date | null];
}

export default function Graph({ dateRange }: GraphProps) {
    const router = useRouter();
    const { user } = useContext(TabContext);
    const [data, setData] = useState([
        { name: 'コンビニ', value: 0 },
        { name: '飲食店', value: 0 },
        { name: 'スーパー', value: 0 },
        { name: 'カフェ', value: 0 },
        { name: 'その他', value: 0 },
    ]);
    const [total, setTotal] = useState(0);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    
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

                let url = `${process.env.NEXT_PUBLIC_API_URL}/api/record/?user_id=${user.id}`;
                
                if (startDate) {
                    url += `&start_date=${startDate.toISOString().split('T')[0]}`;
                }
                if (endDate) {
                    url += `&end_date=${endDate.toISOString().split('T')[0]}`;
                }

                const response = await fetch(url, {
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
                
                const methodTotals = data.reduce((acc: { [key: string]: number }, record: any) => {
                    const method = record.method_display;
                    acc[method] = (acc[method] || 0) + record.recorded_money;
                    return acc;
                }, {});

                const graphData = Object.entries(methodTotals).map(([name, value]) => ({
                    name,
                    value: Number(value)
                }));

                const totalAmount = graphData.reduce((sum, item) => sum + item.value, 0);
                setTotal(totalAmount);
                setData(graphData);
            } catch (e) {
                console.log("ユーザデータの取得に失敗しました。: ", e)
            }
        }
        fetchData();
    }, [user, startDate, endDate]);

    const DynamicPieChart = dynamic(
        () => Promise.resolve(PieChart),
        { ssr: false }
    );
    
    const COLORS = ['#3AA0FF', '#36CBCB', '#4ECB73', '#FAD337', '#F2637B'];

    const renderCustomizedLabel = () => {
        return (
            <Text
                x={150}
                y={160}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xl font-bold"
            >
                {`Total: ¥${total.toLocaleString()}`}
            </Text>
        );
    };

    const CustomLegend = ({ payload }: any) => {
        return (
            <ul className="list-none">
                {payload.map((entry: any, index: number) => (
                    <li key={`item-${index}`} className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                            <div
                                className="w-3 h-3 mr-2"
                                style={{ backgroundColor: entry.color }}
                            />
                            <span>{entry.value}</span>
                        </div>
                        <span className="ml-4">¥{entry.payload.value.toLocaleString()}</span>
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div className="pt-10 w-full">
            <DynamicPieChart width={500} height={300} className="mx-auto bg-white px-5 shadow-md">
                <Pie
                data={data}
                cx={150}
                cy={150}
                outerRadius={110}
                innerRadius={90}
                fill="#8884d8"
                dataKey="value"
                label={renderCustomizedLabel}
                labelLine={false}
                >
                {data.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
                </Pie>

                <Tooltip />
                <Legend 
                    content={<CustomLegend />}
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                    wrapperStyle={{
                        paddingRight: "50px"
                    }}
                />
            </DynamicPieChart>
        </div>
    );
}