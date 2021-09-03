import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Game from '../sudoku/game.js'
import Board from '../sudoku/board.js'
const socket  = require('./socket').socket //Our client socket

export default function GamePage(props) {
    const [opponentName, setOpponentName] = useState('');
    const [isPlayerA, setIsPlayerA] = useState(false);
    const [joinStatus, setJoinStatus] = useState("possible")
    const [gameBoard, setGameBoard] = useState(["..................................................................................",".................................................................................."])
    const [gameDuration, setGameDuration] = useState(0)

    const { gameid } = useParams()

    //Emit only on first render
    useEffect(() =>{
        socket.emit('playerJoinsGame', {gameID: gameid, username: props.username})

        socket.on('joinAttempt', status => {
            setJoinStatus(status)
        })

        socket.on('playerTwoJoined',data=>{
            setGameBoard([data.generatedBoard, data.generatedSolution])
            setGameDuration(data.timeInSeconds*1000)

            if(props.isCreator){
                setIsPlayerA(data.creatorIsPlayerA)
                setOpponentName(data.username2)
            }
            else{
                setIsPlayerA(!data.creatorIsPlayerA)
                setOpponentName(data.username1)
            }
            
        })
    },[props.isCreator,props.username])

    if(joinStatus==="undefined"){
        return <h1>Game doesn't exist.</h1>
    }
    else if(joinStatus==="full"){
        return <h1>Game full.</h1>
    }
    
    return (
        <React.Fragment>
            {
            opponentName === "" 
            ?
                <div>
                    <h1>Waiting for opponent to connect..</h1>
                    <Board gameBoard={".................................................................................."} onSquareChange ={(row,col,val) =>{return}}/>
                    <h1>{`You: ${props.username}`}</h1>
                </div>
            :
                <div>
                    <h1>{`Opponent: ${opponentName}`}</h1>
                    <Game initialBoard={gameBoard[0]} solvedBoard={gameBoard[1]} isPlayerA={isPlayerA} id={gameid} timeInMs={gameDuration}/>
                    <h1>{`You: ${props.username}`}</h1>
                </div>
            }
        </React.Fragment>
    )
}
