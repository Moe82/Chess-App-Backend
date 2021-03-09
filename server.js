const app = require ('express')()
const http = require('http').createServer(app)

const io = require('socket.io')(http, {
  cors: { origin: "*" }
})

const PORT = 3005

io.on('connect', socket => {
  console.log("A user has connected")
  
  socket.on('join', ({gameId}) => { 
    socket.join(gameId)
    console.log("User has joined room")
  })

  socket.on('movePiece', ({ gameId, sourceSquare, targetSquare }) => {
    console.log("Player moved")
    io.sockets.in(gameId).emit('opponentMoved', {sourceSquare: sourceSquare, targetSquare:targetSquare })
  })
})
 
http.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})