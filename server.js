const app = require ('express')()
const http = require('http').createServer(app)

const io = require('socket.io')(http, {
  cors: { origin: "*" }
})

const PORT = 3005

io.on('connect', socket => {
  console.log("A user has connected")

  socket.on('createRoom', ({gameId}) => { 
    console.log("Game host has opened room.")
    socket.join(gameId);
  });
  
  socket.on('joinRoom', ({gameId}) => { 
    console.log("Opponent has joined the hosts room.")
    socket.join(gameId);
    io.sockets.in(gameId).emit('opponentConnected', {})
  });
  
  socket.on('movePiece', ({ gameId, sourceSquare, targetSquare }) => {
    console.log("Player moved")
    io.sockets.in(gameId).emit('opponentMoved', {sourceSquare: sourceSquare, targetSquare:targetSquare })
  })

})
 
http.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})