import {
  Box,
  Stack,
} from "@mui/material";
import {
  useTheme
} from "@mui/material/styles";

import React from "react";
import Message from "./Message";
import Header from "./Header";
import Footer from "./Footer";



function Conversation() {

  const theme = useTheme();

  return (
    <Stack height={"100%"} maxHeight={"100vh"} width={"auto"}>
      {/*Header* */}
      <Header />
      

      {/*Msg* */}

      <Box width={"100%"} sx={{ flexGrow: 1, height:"100%", overflowY: "scroll" }}>
        <Message />
      </Box>

      {/*Footer* */}
      <Footer />
      
    </Stack>
  );
}

export default Conversation;
