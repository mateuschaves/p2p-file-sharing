const path = require('path')
const usernameGen = require("username-generator");
const express = require('express')
const app = express()
var http = require("http").createServer(app);
var io = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});

if (process.env.NODE_ENV === "production"){
  app.use(express.static('./dist/build'));

  app.get('*', (req,res)=>{
    res.sendFile(path.resolve(__dirname,"dist","build","index.html"));
  });
} 

const logger = require("./utils/logger");
const SOCKET_EVENT = {
  CONNECTED: "connected",
  DISCONNECTED: "disconnect",
  USERS_LIST: "users_list",
  REQUEST_SENT: "request_sent",
  REQUEST_ACCEPTED: "request_accepted",
  REQUEST_REJECTED: "request_rejected",
  SEND_REQUEST: "send_request",
  ACCEPT_REQUEST: "accept_request",
  REJECT_REQUEST: "reject_request",
};
const users = {};
const usersList = (usersObj)=>{
	const list = [];
	Object.keys(usersObj).forEach(username=>{
		list.push({username, timestamp:usersObj[username].timestamp});
	})
	return list;
}
io.on("connection", (socket) => {
  console.log('connected')
  
  const username = usernameGen.generateUsername("-");
  if (!users[username]) {
    users[username] = { id: socket.id, timestamp: new Date().toISOString() };
  }
  logger.log(SOCKET_EVENT.CONNECTED, username);
 
  socket.emit(SOCKET_EVENT.CONNECTED, username);

  io.sockets.emit(SOCKET_EVENT.USERS_LIST, usersList(users) );

  socket.on(SOCKET_EVENT.DISCONNECTED, () => {
   
    delete users[username];
   
    io.sockets.emit(SOCKET_EVENT.USERS_LIST, usersList(users) );
    logger.log(SOCKET_EVENT.DISCONNECTED, username);
  });

  socket.on(SOCKET_EVENT.SEND_REQUEST, ({ username, signal, to }) => {
   
    io.to(users[to].id).emit(SOCKET_EVENT.REQUEST_SENT, {
      signal,
      username,
    });
    logger.log(SOCKET_EVENT.SEND_REQUEST, username);
  });

  socket.on(SOCKET_EVENT.ACCEPT_REQUEST, ({ signal, to }) => {
   
    io.to(users[to].id).emit(SOCKET_EVENT.REQUEST_ACCEPTED, {signal});
    logger.log(SOCKET_EVENT.ACCEPT_REQUEST, username);
  });

  socket.on(SOCKET_EVENT.REJECT_REQUEST, ({ to }) => {
  
    io.to(users[to].id).emit(SOCKET_EVENT.REQUEST_REJECTED);
    logger.log(SOCKET_EVENT.REJECT_REQUEST, username);
  });
});
const port = process.env.PORT || 4005;
http.listen(port);
logger.log("server listening on port", port);
