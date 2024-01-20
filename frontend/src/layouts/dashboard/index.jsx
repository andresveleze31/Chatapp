import { useTheme } from "@mui/material/styles";
import React, { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Stack } from "@mui/material";

import Sidebar from "./Sidebar.jsx";

const isAuthenticated = true;

const DashboardLayout = () => {
  const theme = useTheme();

  if(!isAuthenticated){
    return <Navigate to={"/auth/login"} />
  }

  return (
    <Stack direction={"row"}>

      <Sidebar />
      <Outlet />
    </Stack>
  );
};

export default DashboardLayout;
