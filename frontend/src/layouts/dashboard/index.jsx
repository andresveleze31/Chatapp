import { useTheme } from "@mui/material/styles";
import React, { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Stack } from "@mui/material";

import Sidebar from "./Sidebar.jsx";
import { useDispatch, useSelector } from "react-redux";
import { connectSocket, socket } from "../../socket.js";
import { showSnackbar } from "../../redux/slices/app.js";

const DashboardLayout = () => {
  const dispatch = useDispatch();

  const { isLoggedIn } = useSelector((state) => state.auth);

  const user_id = window.localStorage.getItem("user_id");

  useEffect(() => {
    if (isLoggedIn) {
      window.onload = function () {
        if (!window.location.hash) {
          window.location = window.location + "#loaded";
          window.location.reload();
        }
      };

      window.onload();

      if (!socket) {
        connectSocket(user_id);
      }

      //"new_friend_request"

      socket.on("new_friend_request", (data) => {
        dispatch(showSnackbar({ severity: "success", message: data.message }));
      });
      socket.on("request_accepted", (data) => {
        dispatch(showSnackbar({ severity: "success", message: data.message }));
      });
      socket.on("request_sent", (data) => {
        dispatch(showSnackbar({ severity: "success", message: data.message }));
      });
    }

    return () => {
      socket.off("new_friend_request");
      socket.off("request_accepted");
      socket.off("request_sent");
    };
  }, [isLoggedIn, socket]);

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
