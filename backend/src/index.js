const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.use(cors({
  origin: '*',
}));

const server = http.createServer(app);
const io = new Server(server);

function getListOfSockets(ioS) {
  return [...ioS.sockets.sockets].map(s => s[0]);
}

/**
 * @param {("new"|"disconnect"|"message")} type type of log
 */
function logSocket(message="", type="", symbol="+") {
  switch (type) {
    case "disconnect":
      return console.log(`\x1b[1;31m[\x1b[1;37m${symbol}\x1b[1;31m] \x1b[1;37mUSER DISCONNECTED: \x1b[1;37m${message}\x1b[0m`);
    case "new":
      return console.log(`\x1b[1;32m[\x1b[1;37m${symbol}\x1b[1;32m] \x1b[1;37mUSER CONNECTED: \x1b[1;36m${message}\x1b[0m`);
    case "message":
      return console.log(`\x1b[1;32m[\x1b[1;37m${symbol}\x1b[1;32m] \x1b[1;37mMESSAGE: \x1b[1;36m${message}\x1b[0m`);
  }
}

io.on('connection', socket => {
  io.emit('users/all', getListOfSockets(io));

  logSocket(socket.id, 'new');

  socket.on('message', data => {
    if (getListOfSockets(io).includes(data.id)) {
      logSocket(`FROM: ${data.id}, TO: ${socket.id} - ${data.text}`, 'message', '@');
      io.to(data.to).emit('message', {
        from: data.id,
        message: data.text
      });
    }
  })

  socket.on('disconnect', () => {
    io.emit('users/all', );
    logSocket(socket.id, 'disconnect', '-');
  });
});

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log(`\x1b[1;32mLISTENING AT PORT ${PORT}\x1b[0m`);
});

