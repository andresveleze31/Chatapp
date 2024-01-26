import { faker } from '@faker-js/faker';
import { Avatar, Box, Badge, Stack, Typography } from '@mui/material';
import React from 'react'
import { useTheme, styled } from "@mui/material/styles";
import StyledBadge from './StyledBadge';
import { SelectConversation } from '../redux/slices/app';
import { useDispatch } from 'react-redux';



const ChatElement = ({ id, name, img, msg, time, unread, online }) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  return (
    <Box
    onClick={() => {
      dispatch(SelectConversation({room_id: id}))
    }}
      p={2}
      sx={{
        width: "100%",
        borderRadius: 1,
        backgroundColor:
          theme.palette.mode === "light"
            ? "#fff"
            : theme.palette.background.default,
      }}
    >
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Stack direction={"row"} spacing={2}>
          {online ? (
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <Avatar src={faker.image.avatar()} />
            </StyledBadge>
          ) : (
            <Avatar src={faker} />
          )}

          <Stack spacing={0.3}>
            <Typography variant="subtitle2">{name}</Typography>
            <Typography variant="caption">{msg}</Typography>
          </Stack>
        </Stack>
        <Stack spacing={2} alignItems={"center"}>
          <Typography sx={{ fontWeight: 600 }} variant="caption">
            {time}
          </Typography>
          <Badge color="primary" badgeContent={unread}></Badge>
        </Stack>
      </Stack>
    </Box>
  );
};

export default ChatElement;
