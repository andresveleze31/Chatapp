import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";

//Routers
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

app.use(express.json());

dotenv.config();

const whiteList=["http://localhost:3000"];
const corsOptions = {
    origin: function(origin, callback){
        if(whiteList.includes(origin)){
            callback(null, true);
        }else{
            callback(new Error("Error de Cors"));
        }
    }
}
app.use(cors(corsOptions));

//Connect DB.
connectDB();

//Routing
app.use("/auth", authRoutes);
app.use("/user", userRoutes);


//Routing.
app.listen(process.env.PORT, () => {
    console.log("Escuchando en puerto " + process.env.PORT);
})