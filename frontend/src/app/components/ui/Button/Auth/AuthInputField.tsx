import { useState } from "react";

interface AuthInputFieldProps {
    text: string;
    type: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
}

export default function AuthInputField(props: AuthInputFieldProps) {
    const [value, setValue] = useState("");

    return (
        <div className={`flex flex-col ${props.className}`}>
            <input id={props.text}
                type="text"
                placeholder=""
                value={props.value}
                onChange={props.onChange}
                className="w-full h-8 border-b-1 border-black focus:outline-none p-1 peer" 
            />
            <label htmlFor={props.text}
                className="
                    absolute
                    pl-1
                    opacity-60
                    transform
                    -translate-x-1.5
                    -translate-y-5
                    scale-85
                    origin-center
                    peer-focus:-translate-x-1.5
                    peer-focus:-translate-y-5
                    peer-focus:scale-85
                    peer-placeholder-shown:scale-100
                    peer-placeholder-shown:translate-x-0
                    peer-placeholder-shown:translate-y-1
                    duration-150
                    ">
                {props.text}
            </label>
        </div>
    )
}
