import { useContext, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Image from "next/image";
import Graph from "../graph/Graph";
import RecordList from "../record/RecordList";
import { TabContext } from "../Header/Header";

export default function AllTerm() {
    const [date, setDate] = useState(new Date());
    const { setDateRange } = useContext(TabContext);

    useEffect(() => {
        setDateRange([date, date]);
    }, [date, setDateRange]);
    
    return (
        <div className="flex flex-col items-center justify-center pt-7">
            <label className="relative w-full max-w-md cursor-pointer">
                <DatePicker
                    dateFormat="yyyy/MM/dd"
                    selected={date}
                    onChange={(date: Date | null) => date && setDate(date)}
                    className="w-full text-left border-2 border-gray-300 rounded-md pr-64 pl-4 py-3"
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
            <Graph dateRange={[date, date]} />
            <div className="flex justify-center items-center w-full h-full pt-20">
                <RecordList />
            </div>
        </div>
    );
}
