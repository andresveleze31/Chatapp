import { useTheme } from "@mui/material/styles";
import React, { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Stack } from "@mui/material";

import Sidebar from "./Sidebar.jsx";
import { useSelector } from "react-redux";


const DashboardLayout = () => {

  const {isLoggedIn} = useSelector((state) => state.auth);

  const theme = useTheme();

  if (!isLoggedIn) {
    return <Navigate to={"/auth/login"} />;
  }

  return (
    <Stack direction={"row"}>

      <Sidebar />
      <Outlet />
    </Stack>
  );
};

export default DashboardLayout;
