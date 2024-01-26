import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import connectDB from "./config/db.js";

//Routers
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import User from "./models/User.js";

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
  console.log(socket);
  const user_id = socket.handshake.query("user_id");

  const socket_id = socket.id;

  console.log(`User connected ${socket_id}`);

  if (user_id) {
    await User.findByIdAndUpdate(user_id, { socket_id });
  }

  //We can write our socket event listeners here...

  socket.on("friend_request", async (data) => {
    console.log(data.to);

    const to = await User.findById(data.to);

    //TODO => Create a friend Request
    io.to(to.socket_id).emit("new_friend_request", {
      //
    });
  });
});
