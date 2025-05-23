import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Image from "next/image";

export default function AllTerm() {
    const today = new Date();
    const [date, setDate] = useState(today);

    const getInputTextForDate = (date: Date) => setDate(date);
    
    return (
        <div className="flex flex-col items-center justify-center pt-5">
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
            <p>test2</p>
        </div>
    );
}