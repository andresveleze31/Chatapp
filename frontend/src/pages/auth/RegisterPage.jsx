import { Link, Stack, Typography } from "@mui/material";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import RegisterForm from "../../sections/auth/RegisterForm";
import AuthSocial from "../../sections/auth/AuthSocial";

function RegisterPage() {
  return (
    <>
      <Stack sx={{ mb: 5, position: "relative" }} spacing={2}>
        <Typography variant="h4">Get Started With Tawk</Typography>

        <Stack direction={"row"} spacing={0.5}>
          <Typography variant="body2">Already have an account?</Typography>
          <Link variant="subtitle2" component={RouterLink} to={"/auth/login"}>
            Sign in
          </Link>
        </Stack>

        {/*Register Form*/}

        <RegisterForm />



        <Typography
          component={"div"}
          sx={{
            color: "text.secondary",
            mt: 3,
            typography: "caption",
            textAlign: "center",
          }}
        >
          {"By signining up, I agree to "}
          <Link underline="always" color={"text.primary"}>
            Terms of service
          </Link>
          {" and "}
          <Link underline="always" color={"text.primary"}>
            Privacy Policy
          </Link>
        </Typography>
        <AuthSocial />
      </Stack>
    </>
  );
}

export default RegisterPage;
