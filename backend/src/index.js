const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const { logSocket } = require("./utils/logSocket");
const { getListOfSockets } = require("./utils/getListOfSockets");

const app = express();

app.use(helmet());
app.use(morgan("dev"));
app.use(
  cors({
    origin: "*",
  })
);

const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  io.emit("users/all", getListOfSockets(io));

  logSocket(socket.id, "new");

  socket.on('change_name', name => {
    socket['name'] = name;
    io.emit("users/all", getListOfSockets(io));
  });

  socket.on("message", (data) => {
    if (getListOfSockets(io).find(s => s.id === data.id)) {
      logSocket(
        `FROM: ${data.id}, TO: ${socket.id} - ${data.text}`,
        "message",
        "@"
      );
      io.to(data.to).emit("message", {
        from: data.id,
        message: data.text,
      });
    }
  });

  socket.on("disconnect", () => {
    logSocket(socket.id, "disconnect", "-");
    io.emit("users/all", getListOfSockets(io));
  });
});

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log(`\x1b[1;32mLISTENING AT PORT ${PORT}\x1b[0m`);
});
