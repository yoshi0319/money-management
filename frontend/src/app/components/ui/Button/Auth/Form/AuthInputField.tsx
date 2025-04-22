interface AuthInputFieldProps {
    text: string;
    type: string;
    className?: string;
    error?: boolean;
    helperText?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    [key: string]: any;
}

export default function AuthInputField(props: AuthInputFieldProps) {
    const { text, type, className, error, helperText, onChange, ...inputProps } = props;

    return (
        <div className={`flex flex-col ${className}`}>
            <input id={text}
                type={type}
                placeholder=""
                onChange={onChange}
                {...inputProps}
                className={`w-full h-8 border-b-1 ${error ? "border-b-[#d32f2f] focus:border-b-2" : "border-black hover:border-b-2 focus:border-b-2"} focus:outline-none peer`} 
            />
            <label htmlFor={text}
                className={`
                    absolute
                    pl-1
                    transform
                    -translate-x-1
                    -translate-y-5
                    scale-85
                    origin-left
                    peer-focus:-translate-x-1
                    peer-focus:-translate-y-5
                    peer-focus:scale-85
                    peer-placeholder-shown:scale-100
                    peer-placeholder-shown:-translate-x-1
                    peer-placeholder-shown:translate-y-1
                    duration-150
                    ${error ? "text-[#d32f2f]" : "text-black opacity-60"}
                    `}>
                {text}
            </label>
                {error && <p className="text-[#d32f2f] text-sm">{helperText}</p>}
        </div>
    )
}
