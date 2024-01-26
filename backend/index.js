import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import path from "path";

import connectDB from "./config/db.js";

//Routers
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import User from "./models/User.js";
import FriendRequest from "./models/FriendRequest.js";
import OneToOneMessage from "./models/OneToOneMessage.js";

const app = express();

app.use(express.json());

dotenv.config();

const whiteList = ["http://localhost:3000"];
const corsOptions = {
  origin: function (origin, callback) {
    if (whiteList.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Error de Cors"));
    }
  },
};
app.use(cors(corsOptions));

//Connect DB.
connectDB();

//Routing
app.use("/auth", authRoutes);
app.use("/user", userRoutes);

//Routing.
const server = app.listen(process.env.PORT, () => {
  console.log("Escuchando en puerto " + process.env.PORT);
});

//?Socket io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", async (socket) => {
  console.log(JSON.stringify(socket.handshake.query));
  console.log(socket);

  const user_id = socket.handshake.query["user_id"];

  const socket_id = socket.id;

  console.log(`User connected ${socket_id}`);

  if (Boolean(user_id)) {
    await User.findByIdAndUpdate(user_id, { socket_id, status: "Online" });
  }

  //We can write our socket event listeners here...

  socket.on("friend_request", async (data) => {
    console.log(data.to);

    //data => {to, from}

    const to_user = await User.findById(data.to).select("socket_id");
    const from_user = await User.findById(data.from).select("socket_id");

    //create a friend Request.

    await FriendRequest.create({
      sender: data.from,
      recipient: data.to,
    });

    //TODO => Create a friend Request
    //emit event => "new friend request"
    io.to(to_user.socket_id).emit("new_friend_request", {
      //
      message: "New Friend Request Recieved",
    });

    io.to(from_user.socket_id).emit("request_sent", {
      message: "Request sent successfully",
    });

    //emit event => Request_sent
  });

  socket.on("accept_request", async (data) => {
    console.log(data);

    const request_doc = await FriendRequest.findById(data.request_id);

    console.log(request_doc);
    //request_id

    const sender = await User.findById(request_doc.sender);
    const receiver = await User.findById(request_doc.recipient);

    sender.friends.push(request_doc.recipient);
    receiver.friends.push(request_doc.sender);

    await receiver.save({ new: true, validateModifiedOnly: true });
    await sender.save({ new: true, validateModifiedOnly: true });

    await FriendRequest.findByIdAndDelete(data.request_id);

    io.to(sender.socket_id).emit("request_accepted", {
      message: "Friend Request Accepted",
    });
    io.to(receiver.socket_id).emit("request_accepted", {
      message: "Friend Request Accepted",
    });
  });

  socket.on("get_direct_conversations", async ({ user_id }, callback) => {
    const existing_conversations = await OneToOneMessage.find({
      participants: { $all: [user_id] },
    }).populate("participants", "firstName lastName _id email status");
    console.log(existing_conversations);
    callback(existing_conversations);
  });

  socket.on("start_conversation", async (data) => {
    //data: {to, form}

    const { to, from } = data;

    //Check if ther is any existing conversation between users.

    const existing_conversation = await OneToOneMessage.find({
      participants: { $size: 2, $all: [to, from] },
    }).populate("participants", "firstName lastName _id email status");

    console.log(existing_conversation[0], "Existing Conversations");

    //if no existing

    if (existing_conversation.length === 0) {
      let new_chat = await OneToOneMessage.create({
        participants: [to, from],
      });

      new_chat = await OneToOneMessage.findById(new_chat._id).populate(
        "participants",
        "firstName lastName _id email status"
      );

      console.log(new_chat);

      socket.emit("start_chat", new_chat);
    } else {
      socket.emit("start_chat", existing_conversation[0]);
    }
    //if there exi
  });

  //Handle text/lik messages.

  socket.on("get_messages", async (data, callback) => {
    const { messages } = await OneToOneMessage.findById(
      data.conversation_id
    ).select("messages");
    callback(messages);
  });

  socket.on("text_message", async (data) => {
    console.log("Received Message", data);

    //Data : {to, from, message, conversation_id, type}
    const {to, from, message, conversation_id, type} = data;

    const to_user = await User.findById(to);
    const from_user = await User.findById(from);

    const new_message = {
      to,
      from,
      type,
      text: message,
      created_at: Date.now()
    }

    //Create a new Conversation if it doesnt exist yet or add new message to the messages list.
    const chat = await OneToOneMessage.findById(conversation_id);
    chat.messages.push(new_message);
    
    //save to db
    await chat.save({});

    //emit new_message => to user.
    io.to(to_user.socket_id).emit("new_message", {
      conversation_id,
      message: new_message

    });

    //emit new_message ==> from user
    io.to(from_user.socket_id).emit("new_message", {
      conversation_id,
      message: new_message

    });
  });

  socket.on("file_message", (data) => {
    console.log("Recieved Message", data);

    //Data : {to, from, text, file}

    //get the file extension
    const fileExtension = path.extname(data.file.name);

    //generate a unique filename

    const fileName = `${Date.now()}_${Math.floor(
      Math.random() * 10000
    )}${fileExtension}`;

    //Upload file to AWS S3

    //Create a new Conversation if it doesnt exist yet or add new message to the messages list.

    //save to db

    //emit incoming_message => to user.

    //emit out_going_message ==> from user
  });

  socket.on("end", async (data) => {
    //Find user by _id and set the status to offline
    if (data.user_id) {
      await User.findByIdAndUpdate(data.user_id, { status: "Offline" });
    }

    //TODO Broadcast user_disconnected.

    console.log("Closing Connection");
    socket.disconnect(0);
  });
});
