import filterObj from "../helpers/filterObject.js";
import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js";

async function updateMe(req, res, next) {
  const { user } = req;

  const filteredBody = filterObj(
    req.body,
    "firstName",
    "lastName",
    "about",
    "avatar"
  );

  const updated_user = await User.findByIdAndUpdate(user._id, filteredBody, {
    new: true,
    validateModifiedOnly: true,
  });

  res.status(200).json({
    status: "Success",
    data: updated_user,
    message: "Profile Updated Successfully",
  });
}

async function getUsers(req, res, next) {
  const allUsers = await User.find({
    verified: true,
  }).select("firstName lastName _id");

  const this_user = req.user;

  const remaining_users = allUsers.filter(
    (user) =>
      !this_user.friends.includes(user._id) &&
      user._id.toString() !== req.user._id.toString()
  );

  res.status(200).json({
    status: "succes",
    data: remaining_users,
    message: "Users found successfully",
  });
}

async function getRequests(req, res, next){
    const requests = await FriendRequest.find({ recipient: req.user._id }).populate("sender", "_id").select("");
}

async function getFriends(req, res, next) {
  const friends = await User.findById(req.user._id).populate(
    "friends",
    "_id firstName lastName"
  );

  res.status(200).json({
    status: "success",
    data: friends,
    message: "Friends Found Successfully",
  });
}

export { updateMe, getUsers };
