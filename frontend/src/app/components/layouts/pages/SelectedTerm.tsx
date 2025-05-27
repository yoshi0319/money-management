import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Image from "next/image";
import Graph from "../graph/Graph";

export default function SelectedTerm() {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
        yesterday,
        today,
    ]);
    const [start, end] = dateRange;  
    
    return (
        <div className="flex flex-col items-center justify-center pt-7">
            <div className="flex gap-2 w-full max-w-md">
                <label className="relative flex-1 cursor-pointer">
                    <DatePicker
                        selected={start}
                        onChange={(date) => setDateRange([date, end])}
                        dateFormat="yyyy/MM/dd"
                        className="w-full text-left border-2 border-gray-300 rounded-md px-4 py-3"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <Image
                            src="/icons/calendar.svg"
                            alt="calendar"
                            width={18}
                            height={20}
                        />
                    </div>
                </label>
                <span className="flex items-center">-</span>
                <label className="relative flex-1 cursor-pointer">
                    <DatePicker
                        selected={end}
                        onChange={(date) => setDateRange([start, date])}
                        dateFormat="yyyy/MM/dd"
                        className="w-full text-left border-2 border-gray-300 rounded-md px-4 py-3"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <Image
                            src="/icons/calendar.svg"
                            alt="calendar"
                            width={18}
                            height={20}
                        />
                    </div>
                </label>
            </div>
            <Graph dateRange={dateRange}/>
        </div>
    );
}