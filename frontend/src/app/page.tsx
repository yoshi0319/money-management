'use client'

import { Button, ButtonProps, InputAdornment, Link, styled, TextField, Typography } from "@mui/material";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

type Form = {
  username: string;
  firstName: string;
  familyName: string;
  emailAddress: string;
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

  const onSubmit = (data: Form) => {
    console.log(data);
  }
  
  const router = useRouter();

  function goToLogin(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    router.push("/login");
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
    <div className="flex justify-center items-center flex-col">
      <Typography variant="h2" className="pt-24 pb-14">Sign up</Typography>
      <form className="flex flex-col gap-10 w-1/3" onSubmit={handleSubmit(onSubmit)}>                                            {/* 6つあるフォームを囲っている */}
        <TextField id="username" label="Username" variant="standard"
          {...register("username", {
            required: true,
            maxLength: {
              value: 32,
              message: "32文字以内で入力してください"
            }
          }
        )}
        error={!!errors.username}
        helperText={errors.username?.message}/>
        <div className="flex gap-10 w-full">
          <TextField id="firstName" label="First-name" variant="standard" sx={{ width: "50%" }}
            {...register("firstName", {
              required: true,
              maxLength: {
                value: 32,
                message: "32文字以内で入力してください"
              }
            }
          )}
            error={!!errors.firstName}
            helperText={errors.firstName?.message}/>
          <TextField id="familyName" label="Family-name" variant="standard" sx={{ width: "50%" }}
            {...register("familyName", {
              required: true,
              maxLength: {
                value: 32,
                message: "32文字以内で入力してください"
              }
            })}
            error={!!errors.familyName}
            helperText={errors.familyName?.message}/>
        </div>
        <TextField id="emailAddress" label="Email-address" variant="standard"
          {...register("emailAddress", {
            required: true,
            maxLength: {
              value: 32,
              message: "32文字以内で入力してください"
            }
          })}
          error={!!errors.emailAddress}
          helperText={errors.emailAddress?.message}/>
        <TextField id="password"
        type="password"
        label="Password"
        variant="standard"
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <VisibilityOffIcon />
              </InputAdornment>
            ),
          },
        }}
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
        <TextField id="passwordConfirm"
        type="password"
        label="Password(Confirm)"
        variant="standard"
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <VisibilityOffIcon />
              </InputAdornment>
            )
          }
        }}
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
          }})}
        error={!!errors.passwordConfirm}
        helperText={errors.passwordConfirm?.message}/>
        <div className="flex justify-center w-full h-full pt-14">
          <ColorButton variant="contained" type="submit" size="small" className="w-64 h-12">Sign up</ColorButton>
        </div>
      </form>
      <div  className="flex flex-col justify-center items-center gap-1 pt-5 text-lg">
        <p>Already have an account?</p>
        <a href="/login" onClick={goToLogin} className="text-blue-500 hover:text-blue-700">Sign in</a>
      </div>
    </div>
  );
}