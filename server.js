const express = require("express");
const connectDB = require("./config/database");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/authRoute");
const productRoute = require("./routes/productRoutes");
const postRoute = require("./routes/postRoute");
// const bodyParser = require("body-parser");
const { Server } = require("socket.io");
const { createServer } = require("http");

//configure env
dotenv.config();
//Db connect
connectDB();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    // methods: ["GET", "POST"],
    credentials: true, //For headers like cookies
  },
});

// let users = [];

//middkeware
app.use(cors());
app.use(express.json());

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
// app.use(morgan("dev"));

//Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1", productRoute);
app.use("/api/v1", postRoute);

const activeUsers = new Map();

io.on("connection", (socket) => {
  console.log("user connected", socket.id);

  socket.on("userLogin", ({ user, room }) => {
    console.log("user", user);
    // users.push({ ...user, socketId: socket.id });
    // console.log("users", users);

    socket.join(room);

    activeUsers.set(socket.id, { ...user, socketId: socket.id, room });
    console.log("activeUsers", activeUsers);
    io.to(room).emit("userOnline", Array.from(activeUsers.values()));

    // socket.broadcast.emit("userOnline", { ...user, socketId: socket.id });
  });

  socket.on("message", (data) => {
    console.log("message", data);
    io.to(data.room).emit("replyMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("use disconnected", socket.id);

    // Remove user from the activeUsers map
    if (activeUsers.has(socket.id)) {
      const { user, room } = activeUsers.get(socket.id);
      activeUsers.delete(socket.id);

      // Broadcast leave message to all clients in the room
      // io.to(room).emit("message", `${username} left the room.`);

      // Broadcast updated user list to all clients in the room
      io.to(room).emit("userOnline", Array.from(activeUsers.values()));
    }
  });
});

server.listen(process.env.PORT || 4004, () => {
  console.log(`sever running on ${process.env.PORT}`);
});
