import { app } from "./app.js";
import http from "http";

const server = http.createServer(app);

const port = process.env.PORT || 8000;

server.listen(port, () => {
    console.log(`App running on port ${port}`);
} );