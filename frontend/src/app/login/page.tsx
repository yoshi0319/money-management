'use client'

import { Typography } from "@mui/material";
import AuthInputField from "../components/ui/Button/Auth/Form/AuthInputField";

export default function Login() {
    const onSubmit = () => {
        console.log("submit")
    }
    return (
        <main className="flex justify-center items-center flex-col">
            <Typography variant="h2" className="pt-24 pb-14">Sign in</Typography>
            <form className="flex flex-col gap-15 w-1/3" onSubmit={onSubmit}>
                <AuthInputField text="Email-address or Username" type="text" />
                <AuthInputField text="Password" type="password" />
            </form>
        </main>
    )
}