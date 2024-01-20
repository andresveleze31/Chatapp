import {
  Box,
  Stack,
  Typography,
  IconButton,
  Tabs,
  Tab,
  Grid,
} from "@mui/material";
import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";
import { useDispatch } from "react-redux";
import { updateSidebarType } from "../redux/slices/app";
import { CaretLeft, X } from "phosphor-react";
import { faker } from "@faker-js/faker";
import { SHARED_DOCS, SHARED_LINKS } from "../data";
import { DocMsg, LinkMsg } from "./conversation/MessageTypes";
import Message from "./conversation/Message";

function StarredMessages() {
  const theme = useTheme();
  const dispatch = useDispatch();

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: 320, height: "100vh" }}>
      <Stack sx={{ height: "100%" }}>
        <Box
          sx={{
            boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
            width: "100%",
            backgroundColor:
              theme.palette.mode === "light"
                ? "#F8FAFF"
                : theme.palette.background,
          }}
        >
          <Stack
            alignItems={"center"}
            spacing={3}
            sx={{ height: "100%", p: 2 }}
            direction={"row"}
          >
            <IconButton
              onClick={() => {
                dispatch(updateSidebarType("CONTACT"));
              }}
            >
              <CaretLeft />
            </IconButton>
            <Typography variant="subtitle2">Starred Messages</Typography>
          </Stack>
        </Box>



        <Stack
          sx={{
            height: "100%",
            position: "relative",
            flexGrow: 1,
            overflowY: "scroll",
          }}
          p={3}
          spacing={3}
        >

            <Message />          
          
        </Stack>
      </Stack>
    </Box>
  );
}

export default StarredMessages;
