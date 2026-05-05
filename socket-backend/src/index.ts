import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
type IncomingMessage = {
  text: string;
};

type OutgoingMessage = {
  text: string;
  sender: string;
};



const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});



io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("send_message", (data: IncomingMessage) => {
    console.log("Original Message:", data.text);

    // 🔥 reverse logic
    const reversedText = data.text.split("").reverse().join("");

    console.log("Reversed Message:", reversedText);

    const response: OutgoingMessage = {
      text: reversedText,
      sender: socket.id, // ✅ always trust server
    };

    // send to all clients
    io.emit("receive_message", response);

    // 👉 OR only send back to sender:
    // socket.emit("receive_message", response);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });


});

server.listen(8080, () => {
  console.log("Server running on port 8080");
});