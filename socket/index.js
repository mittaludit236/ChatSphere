const io = require("socket.io")(8900, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
  console.log(users);
  console.log("hello");
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  console.log(users);
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  socket.on("joinRoom", (conversationId) => {
    socket.join(conversationId);
    console.log(`User with socket ID ${socket.id} joined room ${conversationId}`);
  });

  socket.on("newConversation", ({ senderId, receiverId }) => {
    // Handle the creation of a new conversation here
    console.log(`New conversation requested between ${senderId} and ${receiverId}`);

    // You can perform any necessary database operations to create the conversation

    // Once the conversation is created, emit a "conversationCreated" event to the sender and receiver
    const senderSocket = getUser(senderId);
    const receiverSocket = getUser(receiverId);

    if (senderSocket) {
      io.to(senderSocket.socketId).emit("conversationCreated", { conversationId: 'your_conversation_id' });
    }

    if (receiverSocket) {
      io.to(receiverSocket.socketId).emit("conversationCreated", { conversationId: 'your_conversation_id' });
    }
  });

  socket.on("sendMessage", ({ senderId, receiverId, text, conversationId }) => {
    console.log(`Message from ${senderId} to ${receiverId} in conversation ${conversationId}`);
    io.to(conversationId).emit("getMessage", {
      senderId,
      text,
      conversationId,
    });
  });

  // when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });

  socket.emit("welcome", "hello socket");
});
