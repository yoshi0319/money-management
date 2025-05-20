'use client'

import { Button, ButtonProps, styled, Typography } from "@mui/material";
import AuthInputField from "../../components/elements/Button/Auth/Form/AuthInputField";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import SignPrompt from "../../components/elements/Button/Auth/Button/SignPrompt";
import { useEffect } from "react";

type LoginFormData = {
    user_name_or_email_address: string;
    password: string;
    rememberMe: boolean;
};

export default function Login() {
    const router = useRouter();

    useEffect(() => {
        const rememberMe = localStorage.getItem("rememberMe") || false;
        if(rememberMe) {
            router.push("/dashboard");
        }
    }, [])

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginFormData>({
        defaultValues: {
            user_name_or_email_address: "",
            password: "",
            rememberMe: false,
        }
    });

    const onSubmit = async (data: LoginFormData) => {
        const requestData = data.user_name_or_email_address.includes('@')
            ? { email_address: data.user_name_or_email_address, password: data.password }
            : { user_name: data.user_name_or_email_address, password: data.password };

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/token/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'ログインに失敗しました');
            }

            const result = await response.json();
            localStorage.setItem('token', result.access);
            if (data.rememberMe) {
                localStorage.setItem('rememberMe', 'true');
            }

            router.push('/dashboard');
        } catch (error) {
            console.error('Login error:', error);
            console.log(error instanceof Error ? error.message : 'ログインに失敗しました');
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
                          {...register("user_name_or_email_address", {
                            required: true,
                            maxLength: {
                              value: 32,
                              message: "32文字以内で入力してください"
                            },
                          })}
                          error={!!errors.user_name_or_email_address}
                          helperText={errors.user_name_or_email_address?.message}/>
                <AuthInputField
                          text="Password"
                          type="password"
                          {...register("password", {
                            required: true,
                            maxLength: {
                              value: 32,
                              message: "32文字以内で入力してください"
                            },
                          })}
                          error={!!errors.password}
                          helperText={errors.password?.message}/>
                <div className="flex flex-row gap-2 items-center">
                    <input
                        type="checkbox"
                        {...register("rememberMe")}
                    />
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