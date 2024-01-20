import React, { Suspense, lazy } from "react";
import Chats from "./Chats";
import { Box, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Conversation from "../../components/conversation";
import Contact from "../../components/Contact";
import { useSelector } from "react-redux";
import SharedMessages from "../../components/SharedMessages";
import StarredMessages from "../../components/StarredMessages";

const Cat = lazy(() => import("../../components/Cat"));

const GeneralApp = () => {
  const theme = useTheme();

  const { sidebar } = useSelector((store) => store.app);

  return (
    <>
      <Stack direction={"row"}>
        <Chats />
        <Box
          sx={{
            height: "100%",
            width: sidebar.open ? "calc(100vw - 740px)" : "calc(100vw - 420px)",
            backgroundColor:
              theme.palette.mode === "light"
                ? "#F0F4FA"
                : theme.palette.background.default,
          }}
        >
          <Conversation />
        </Box>

        {sidebar.open &&
          (() => {
            switch (sidebar.type) {
              case "CONTACT":
                return <Contact />;
              case "SHARED":
                return <SharedMessages />;

              case "STARRED":
                return <StarredMessages />
              default:
                break;
            }
          })()}
      </Stack>
    </>
  );
};

export default GeneralApp;
