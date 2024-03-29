import { Link, Stack, Typography } from "@mui/material";
import React from "react";
import {Link as RouterLink} from "react-router-dom"
import AuthSocial from "../../sections/auth/AuthSocial";
import LoginForm from "../../sections/auth/LoginForm";

function LoginPage() {
  return (
    <>
      <Stack sx={{mb:5, position: "relative"}} spacing={2}>
        <Typography variant="h4">Login to Tawk</Typography>
        <Stack direction={"row"} spacing={0.5}>
          <Typography variant="body2">New User?</Typography>
          <Link to="/auth/register" variant="subtitle2" component={RouterLink}>
            Create an account
          </Link>
        </Stack>

        {/*Login Form*/}
        <LoginForm />


        {/*Auth Social*/}
        <AuthSocial />

      </Stack>
    </>
  );
}

export default LoginPage;
