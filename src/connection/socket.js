import io from 'socket.io-client'

const URL = 'https://sudoku-1v1-backend.herokuapp.com/'

const socket = io(URL)

var mySocketID

socket.on('gameWasCreated', data => {
    console.log("A new game has been created. Game id: " + data.gameID + " Socket id: " + data.socketID)
    mySocketID = data.socketID
})

export {
    socket, mySocketID
}