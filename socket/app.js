import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: [
      process.env.NODE_ENV === "production" ? process.env.VITE_SOCKET_URL : "http://localhost:5173",
      "http://localhost:3000"
    ],
    credentials: true,
    methods: ["GET", "POST"]
  },
});

let onlineUser = [];

const addUser = (userId, socketId) => {
  const userExists = onlineUser.find((user) => user.userId === userId);
  if (!userExists) {
    onlineUser.push({ userId, socketId });
  }
  console.log("After adding online users;", onlineUser);
};

const removeUser = (socketId) => {
  onlineUser = onlineUser.filter((user) => user.socketId !== socketId);
  console.log("After remove online users;", onlineUser);
};

const getUser = (userId) => {
  return onlineUser.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  socket.on("newUser", (userId) => {
    addUser(userId, socket.id);
    console.log(onlineUser);
  });

  socket.on("sendMessage", ({ receiverId, data }) => {
    const receiver = getUser(receiverId);
    if (receiver) {
      io.to(receiver.socketId).emit("getMessage", data);
    }
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
  });
});

io.listen(process.env.PORT || 4000);
