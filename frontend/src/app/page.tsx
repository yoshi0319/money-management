'use client'

import { Button, ButtonProps, InputAdornment, Link, styled, TextField, Typography } from "@mui/material";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {

  const [values, setValues] = useState({
    username: "",
    firstName: "",
    familyName: "",
    emailAddress: "",
    password: "",
    passwordConfirm: "",
  });
  const router = useRouter();

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    })
  }

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
      <Typography variant="h1" className="pt-48 pb-20">Sign up</Typography>
      <div className="flex flex-col gap-10 w-1/3">                                            {/* 6つあるフォームを囲っている */}
        <TextField id="standard-basic" label="Username" variant="standard"/>
        <div className="flex gap-10 w-full">
          <TextField id="standard-basic" label="First-name" variant="standard" sx={{ width: "50%" }}/>
          <TextField id="standard-basic" label="Family-name" variant="standard" sx={{ width: "50%" }}/>
        </div>
        <TextField id="standard-basic" label="Email-address" variant="standard" />
        <TextField id="standard-password-input"
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
        }} />
        <TextField id="standard-password-input"
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
        }} />
      </div>
      <div className="flex justify-center w-full h-full pt-20">
        <ColorButton variant="contained" size="large" className="w-1/7 h-14">Sign up</ColorButton>
      </div>
      <div  className="flex flex-col justify-center items-center gap-1 pt-5 text-lg">
        <p>Already have an account?</p>
        <a href="/login" onClick={goToLogin} className="text-blue-500 hover:text-blue-700">Sign in</a>
      </div>
    </div>
  );
}
