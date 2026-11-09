const http = require("http");
const { Server } = require("socket.io");

const PORT = 4000;
const httpServer = http.createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`[Controller Relay] Connected: ${socket.id}`);

  socket.on("controller:input", (data) => {
    socket.broadcast.emit("controller:input", data);
  });

  socket.on("controller:action", (action) => {
    socket.broadcast.emit("controller:action", action);
  });

  socket.on("controller:settings", (settings) => {
    socket.broadcast.emit("controller:settings", settings);
  });

  socket.on("game:telemetry", (telemetry) => {
    socket.broadcast.emit("game:telemetry", telemetry);
  });

  socket.on("game:haptic", (pattern) => {
    socket.broadcast.emit("game:haptic", pattern);
  });

  socket.on("disconnect", () => {
    console.log(`[Controller Relay] Disconnected: ${socket.id}`);
    socket.broadcast.emit("controller:disconnected");
  });
});

httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`[Controller Relay] Listening on port ${PORT}`);
});
