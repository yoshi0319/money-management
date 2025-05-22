import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function SelectedTerm() {
    
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
        null,
        null,
    ]);
    const [start, end] = dateRange;  
    
    
    return (
        <div className="flex flex-col items-center justify-center pt-5">
            <DatePicker
                selectsRange={true}
                startDate={start}
                endDate={end}
                onChange={(dates: [Date | null, Date | null]) => {
                setDateRange(dates);
                }}
                isClearable={true}
                className="border-2 border-gray-300 rounded-md px-20 py-3"
            />
            <p>test2</p>
        </div>
    );
}