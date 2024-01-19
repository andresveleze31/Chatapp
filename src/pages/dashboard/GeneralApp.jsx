import React, { Suspense, lazy } from "react";
import Chats from "./Chats";
import { Box, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Conversation from "../../components/conversation";

const Cat = lazy(() => import("../../components/Cat"));

const GeneralApp = () => {
  const theme = useTheme();
  return (
    <>
      <Stack direction={"row"}>
        <Chats />
        <Box
          sx={{
            height: "100%",
            width: "calc(100vw - 420px)",
            backgroundColor: theme.palette.mode === "light" ? "#F0F4FA" : theme.palette.background.default,
          }}
        >
          <Conversation />
        </Box>
      </Stack>
    </>
  );
};

export default GeneralApp;
