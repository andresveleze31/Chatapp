import { Box, Stack } from "@mui/material";
import React from "react";
import { Chat_History } from "../../data";
import { DocMsg, LinkMsg, MediaMsg, ReplyMsg, TextMsg, TimeLine } from "./MessageTypes";


function Message({menu}) {
  

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
                  return <MediaMsg el={el} menu={menu} />
                case "doc":
                  return <DocMsg  el={el} menu={menu}/>

                case "link":
                  return <LinkMsg el={el} menu={menu} />

                case "reply":
                  return <ReplyMsg el={el} menu={menu} />

                default:
                  return <TextMsg key={el.id} el={el} menu={menu} />;
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
