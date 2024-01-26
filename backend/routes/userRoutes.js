import express from "express";
import { getFriends, getRequests, getUsers, updateMe } from "../controllers/userController.js";
import { protect } from "../controllers/authController.js";

const router = express.Router();

router.patch("/update-me", protect ,updateMe);

router.get("/get-users", protect, getUsers);
router.get("/get-friends", protect, getFriends);
router.get("/get-friend-requests", protect, getRequests);


export default router;