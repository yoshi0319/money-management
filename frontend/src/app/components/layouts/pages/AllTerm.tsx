import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import React, { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export default function AllTerm() {
    useEffect(() => {
        const date = new Date();
        setDate(dayjs(date));
    }, [])

    const [date, setDate] = useState<Dayjs | null>(dayjs("2000/01/01"));
    
    return (
        <div className="flex flex-col items-center justify-center pt-5">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                    value={date}
                    onChange={(newValue: Dayjs | null) => {
                        setDate(newValue);
                    }}
                    />
            </LocalizationProvider>
        </div>
    );
}