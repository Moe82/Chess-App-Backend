const app = require ('express')()
const http = require('http').createServer(app)

const io = require('socket.io')(http, {
  cors: { origin: "*" }
})

const PORT = process.env.PORT || 3005

var games = {}

io.on('connect', socket => {
  console.log("A user has connected")

  socket.on('joinRoom', ({gameId}) => { 
    console.log("A user has joined the room")
    socket.join(gameId);
    // if no saved data for the current game is available, set start position to "start".
    if (games[gameId] == undefined) {
      games[gameId] = "start"
    }
    // on attempting to join, always emit the current games state
    socket.emit("currentGameState", games[gameId])
    // if the room size is >= 2, emit message to all sockets connected to the room. 
    if ((io.sockets.adapter.rooms.get(gameId).size) >= 2) {
      io.sockets.in(gameId).emit('opponentConnected', {})
    }
  });

  socket.on('movePiece', ({ gameId, sourceSquare, targetSquare, fen }) => {
    console.log("Player moved")
    socket.broadcast.emit('opponentMoved', {sourceSquare: sourceSquare, targetSquare:targetSquare })
    games[gameId] = fen
  })

  socket.on('sendMessage', ({ gameId, message} ) => {
    console.log("Message recieved")
    socket.broadcast.emit('opponentSentMsg', message)
  })

  socket.on('resetBoard', ({gameId, winner}) => {
    console.log("Game over")
    games[gameId] = "start"
    io.sockets.in(gameId).emit('gameOver', winner)
  })

})
 
http.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})