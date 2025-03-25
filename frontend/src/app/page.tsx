import { TextField, Typography } from "@mui/material";

export default function Register() {
  return (
    <div className="flex justify-center items-center flex-col">
      <Typography variant="h1" className="pt-48 pb-20">Sign up</Typography>
      <div className="flex flex-col gap-10 w-1/3">
        <TextField id="standard-basic" label="Username" variant="standard"/>
        <div className="flex gap-10 w-full">
          <TextField id="standard-basic" label="First-name" variant="standard" sx={{ width: "50%" }}/>
          <TextField id="standard-basic" label="Family-name" variant="standard" sx={{ width: "50%" }}/>
        </div>
        <TextField id="standard-basic" label="Email-address" variant="standard" />
        <TextField id="standard-password-input" type="password" label="Password" variant="standard" />
        <TextField id="standard-password-input" type="password" label="Password(Confirm)" variant="standard" />
      </div>
    </div>
  );
}
