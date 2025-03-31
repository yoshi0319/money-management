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

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log(values);
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
      <Typography variant="h2" className="pt-24 pb-14">Sign up</Typography>
      <form className="flex flex-col gap-10 w-1/3" onSubmit={handleSubmit}>                                            {/* 6つあるフォームを囲っている */}
        <TextField id="standard-basic" name="username" label="Username" variant="standard" value={values.username} onChange={handleInputChange} />
        <div className="flex gap-10 w-full">
          <TextField id="standard-basic" name="firstName" label="First-name" variant="standard" sx={{ width: "50%" }} value={values.firstName} onChange={handleInputChange}/>
          <TextField id="standard-basic" name="familyName" label="Family-name" variant="standard" sx={{ width: "50%" }} value={values.familyName} onChange={handleInputChange}/>
        </div>
        <TextField id="standard-basic" name="emailAddress" label="Email-address" variant="standard" value={values.emailAddress} onChange={handleInputChange}/>
        <TextField id="standard-password-input"
        name="password"
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
        }} value={values.password} onChange={handleInputChange}/>
        <TextField id="standard-password-input"
        name="passwordConfirm"
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
        }} value={values.passwordConfirm} onChange={handleInputChange}/>
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
