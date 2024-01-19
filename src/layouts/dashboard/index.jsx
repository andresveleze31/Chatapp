import { useTheme } from "@mui/material/styles";
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Stack } from "@mui/material";

import Sidebar from "./Sidebar.jsx";

const DashboardLayout = () => {
  const theme = useTheme();

  return (
    <Stack direction={"row"}>

      <Sidebar />
      <Outlet />
    </Stack>
  );
};

export default DashboardLayout;
