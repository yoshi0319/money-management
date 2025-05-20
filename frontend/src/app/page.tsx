'use client'

import { Button, ButtonProps, styled, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import SignPrompt from "./components/elements/Button/Auth/Button/SignPrompt";
import AuthInputField from "./components/elements/Button/Auth/Form/AuthInputField";

type Form = {
  user_name: string;
  first_name: string;
  family_name: string;
  email_address: string;
  password: string;
  passwordConfirm: string;
}

export default function Register() {
  const {
    register,
    getValues,
    handleSubmit,
    formState: {
      errors,
    }
  } = useForm<Form>();

  const router = useRouter();

  const onSubmit = async (data: Form) => {
    const requestData = {
      user_name: data.user_name,
      first_name: data.first_name,
      family_name: data.family_name,
      email_address: data.email_address,
      password: data.password,
    };
    console.log(requestData);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestData)
      })

      if(!response.ok) {
        const errorData = await response.json();
        console.error("APIエラー:", errorData);
        alert(JSON.stringify(errorData)); 
        throw new Error(errorData.detail || "ユーザー登録に失敗しました");
      }

      router.push("/login");      

    } catch (error) {
      console.error(error);
    }
  }

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
      <Typography variant="h2" className="pt-24 pb-14">Sign up</Typography>
      <form className="flex flex-col gap-15 w-1/3" onSubmit={handleSubmit(onSubmit)}>
        <AuthInputField
          text="User Name"
          type="text"
          {...register("user_name", {
            required: true,
            maxLength: {
              value: 32,
              message: "32文字以内で入力してください"
            },
          })}
          error={!!errors.user_name}
          helperText={errors.user_name?.message}/>
        <div className="flex gap-10 w-full">
          <AuthInputField
            text="First Name"
            type="text"
            className="w-1/2"
            {...register("first_name", {
              required: true,
              maxLength: {
                value: 32,
                message: "32文字以内で入力してください"
              }
            })}
            error={!!errors.first_name}
            helperText={errors.first_name?.message}/>
          <AuthInputField
            text="Family Name"
            type="text"
            className="w-1/2"
            {...register("family_name", {
              required: true,
              maxLength: {
                value: 32,
                message: "32文字以内で入力してください"
              }
            })}
            error={!!errors.family_name}
            helperText={errors.family_name?.message}/>
        </div>
        <AuthInputField
          text="Email Address"
          type="email"
          {...register("email_address", {
            required: true,
            maxLength: {
              value: 32,
              message: "32文字以内で入力してください"
            }
          })}
          error={!!errors.email_address}
          helperText={errors.email_address?.message}/>
        <AuthInputField
          text="Password"
          type="password"
          {...register("password", {
            required: true,
            maxLength: {
              value: 32,
              message: "32文字以内で入力してください"
            },
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
              message: "半角英大文字・小文字・数字をそれぞれ1文字以上含む8文字以上で入力してください"
            }
          })}
          error={!!errors.password}
          helperText={errors.password?.message}/>
        <AuthInputField
          text="Password (Confirm)"
          type="password"
          {...register("passwordConfirm", {
            required: true,
            maxLength: {
              value: 32,
              message: "32文字以内で入力してください"
            },
            validate: (data) => {
              if (data !== getValues("password")) {
                return "パスワードが一致しません";
              }
            }
          })}
          error={!!errors.passwordConfirm}
          helperText={errors.passwordConfirm?.message}/>
        <div className="flex justify-center w-full h-full pt-14">
          <ColorButton variant="contained" type="submit" size="small" className="w-64 h-12">Sign up</ColorButton>
        </div>
      </form>
      <div  className="flex flex-col justify-center items-center gap-1 pt-5 text-lg">
        <SignPrompt text="Already have an account?" linkText="Sign in" linkHref="/auth/login" className="flex flex-col justify-center items-center" />
      </div>
    </main>
  );
}