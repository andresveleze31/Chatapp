import { Dialog, DialogContent, Stack, Tab, Tabs } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FetchFriendRequest, FetchFriends, FetchUsers } from "../../redux/slices/app";

const UsersList = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(FetchUsers());
  }, []);

  const { users } = useSelector((state) => state.app);

  return (
    <>
      {users.map((el, idx) => {
        //TODO => Render UserComponent
        return <></>;
      })}
    </>
  );
};

const FriendsList = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(FetchFriends());
  }, []);

  const { friends } = useSelector((state) => state.app);
  const friendsArray = friends.friends;

  return (
    <>
      {friendsArray.map((el, idx) => {
        //TODO => Render FriendComponent
        return <></>;
      })}
    </>
  );
};

const FriendRequestList = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(FetchFriendRequest());
  }, []);

  const { friendRequests } = useSelector((state) => state.app);

  return (
    <>
      {friendRequests.map((el, idx) => {
        //TODO => Render friendRequestsComponent
        return <></>;
      })}
    </>
  );
};

function Friends({ open, handleClose }) {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={open}
      keepMounted
      onClose={handleClose}
      sx={{ p: 4 }}
    >
      <Stack p={2} sx={{ width: "100%" }}>
        <Tabs value={value} onChange={handleChange} centered>
          <Tab label="Explore" />
          <Tab label="Friends" />
          <Tab label="Request" />
        </Tabs>
      </Stack>

      <DialogContent>
        <Stack sx={{ height: "100%" }}>
          <Stack spacing={2.5}>
            {(() => {
              switch (value) {
                case 0:
                  //Display all Users
                  return <UsersList />
                case 1:
                  //Display all Friends
                  return <FriendsList />
                case 2:
                  //Displat all friend request
                  return <FriendRequestList />
                default:
                  break;
              }
            })()}
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

export default Friends;
