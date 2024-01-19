import { Box, Stack } from "@mui/material";
import React from "react";
import { Chat_History } from "../../data";
import { DocMsg, LinkMsg, MediaMsg, ReplyMsg, TextMsg, TimeLine } from "./MessageTypes";


function Message() {
  

  return (
    <Box p={3}>
      <Stack spacing={3}>
        {Chat_History.map((el) => {
            el.type === "divider" && <TimeLine key={el.id} el={el} />;
          switch (el.type) {
            case "divider":
              // Time Line
              return <TimeLine key={el.id} el={el} />;
            case "msg":
              switch (el.subtype) {
                case "img":
                  return <MediaMsg el={el} />
                case "doc":
                  return <DocMsg  el={el}/>

                case "link":
                  return <LinkMsg el={el} />

                case "reply":
                  return <ReplyMsg el={el} />

                default:
                  return <TextMsg key={el.id} el={el} />;
              }
            default:
              // Unreachable code
              return <p>Something</p>;
          }
        })}
      </Stack>
    </Box>
  );
}

export default Message;
