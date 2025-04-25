'use client'

import { Button, ButtonProps, Checkbox, FormControlLabel, styled, Typography } from "@mui/material";
import AuthInputField from "../components/ui/Button/Auth/Form/AuthInputField";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import SignPrompt from "../components/ui/Button/Auth/Button/SignPrompt";
import { error } from "console";

type LoginFormData = {
    username: string;
    password: string;
    rememberMe: boolean;
};

export default function Login() {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginFormData>({
        defaultValues: {
            rememberMe: false
        }
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            const response = await fetch('/api/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('ログインに失敗しました');
            }

            const result = await response.json();
            localStorage.setItem('token', result.access);
            if (data.rememberMe) {
                localStorage.setItem('rememberMe', 'true');
            }
            router.push('/dashboard');
        } catch (error) {
            console.log(error)
        }
    };

    const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
        color: theme.palette.getContrastText("#DEDEDE"),
        fontSize: "1.2rem",
        backgroundColor: "#DEDEDE",
        '&:hover': {
            backgroundColor: "#C1C1C1",
        },
    }));

    return (
        <main className="flex justify-center items-center flex-col">
            <Typography variant="h2" className="pt-24 pb-40">Sign in</Typography>
            <form className="flex flex-col gap-15 w-1/3" onSubmit={handleSubmit(onSubmit)}>
                <AuthInputField
                    text="Email-address or Username"
                    type="text"
                    {...register("username", { required: "ユーザー名またはメールアドレスは必須です" })}
                    error={!!errors.username}
                    helperText={errors.username?.message}
                />
                <AuthInputField
                    text="Password"
                    type="password"
                    {...register("password", { required: "パスワードは必須です" })}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                />
                <div className="flex flex-row gap-2">
                    <input type="checkbox" />
                    <p>Remember me</p>
                </div>
                <div className="flex justify-center w-full h-full pt-14">
                    <ColorButton variant="contained" type="submit" size="small" className="w-64 h-12">Sign in</ColorButton>
                </div>
            </form>
            <div className="flex flex-col justify-center items-center gap-1 pt-5 text-lg">
                <SignPrompt text="Don't have an account?" linkText="Sign up" linkHref="/" className="flex flex-col justify-center items-center" />
            </div>
        </main>
    );
}