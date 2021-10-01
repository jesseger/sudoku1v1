import React, { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import Game from '../sudoku/game.js'
import Board from '../sudoku/board.js'
import { Typography, TextField, Button, Tooltip, Slider } from '@material-ui/core';
import Popup from '../components/popup.js'
import { GameContext } from '../context';
import avatarA from '../assets/playerA.jpg'
import avatarB from '../assets/playerB.jpg'

const socket  = require('./socket').socket //Our client socket

export default function GamePage(props) {
    const [isPlayerA, setIsPlayerA] = useState(false);
    const [joinStatus, setJoinStatus] = useState("possible")
    const [gameLoserIsA, setGameLoserIsA] = useState(null) 
    const [gameBoard, setGameBoard] = useState(["..................................................................................",".................................................................................."])
    const [gameDuration, setGameDuration] = useState(0) //in seconds
    const [gameDifficulty, setGameDifficulty] = useState(50)
    const [didCopyLink, setDidCopyLink] = useState(false)

    const [openPopup, setOpenPopup] = useState(false)
    const [didReqRematch, setDidReqRematch] = useState(false)
    const [gameCounter, setGameCounter] = useState(0)
    const context = useContext(GameContext)

    const { gameid } = useParams()

    useEffect(() =>{
        socket.emit('playerJoinsGame', {gameID: gameid, username: context.myName}) 

        socket.on('joinAttempt', status => {
            setJoinStatus(status)
        })

        socket.on('playerTwoJoined',data=>{
            setGameBoard([data.generatedBoard, data.generatedSolution])
            setGameDuration(data.timeInSeconds)
            setGameDifficulty(data.difficulty)
            if(props.isCreator){
                setIsPlayerA(data.creatorIsPlayerA)
                context.setOppName(data.username2) 
            }
            else{
                setIsPlayerA(!data.creatorIsPlayerA)
                context.setOppName(data.username1) 
            }
        })

        socket.on('OtherPlayerLeft',()=>{
            setJoinStatus("opponentLeft")
        })

        socket.on('startRematch', data=>{
            setDidReqRematch(false)
            setGameDuration(data.timeInSeconds)
            setGameBoard([data.generatedBoard, data.generatedSolution])
            setIsPlayerA(data.creatorIsPlayerA===props.isCreator)
            setOpenPopup(false)
            setGameLoserIsA(null)
            setGameCounter(prevCount => prevCount+1)
        })
    },[]) 

    function handleGamePageOver(loserIsA){
        setOpenPopup(true)
        setGameLoserIsA(loserIsA)
    }

    function handleRematchClick(){
        setDidReqRematch(true)
        if(props.isCreator){ 
            socket.emit('createNewGame', {gameID: gameid, difficulty: gameDifficulty, timeInSeconds: gameDuration}) 
        }
        socket.emit('requestRematch', {gameID: gameid})
    }

    function handleDifficultyChange(event, value){
        setGameDifficulty(value)
    }

    function handleDurationChange(event, value){
        setGameDuration(value)
    }

    if(joinStatus==="undefined"){
        return <Typography variant="h2">This game doesn't exist.</Typography>
    }
    else if(joinStatus==="full"){
        return <Typography variant="h2">This game is full.</Typography>
    }
    else if(joinStatus==='opponentLeft'){
        return <Typography variant="h2">Your opponent left.</Typography>
    }
    
    return (
        <React.Fragment>
            {
            context.oppName === "" 
            ?
                <div className="container">
                    <div className="inner">
                    <TextField
                    id="gameLink"
                    label="Share this link with a friend"
                    value= {window.location.href}
                    fullWidth={true}
                    onFocus={event => {event.target.select()}}
                    InputProps={{endAdornment: 
                        <Tooltip title={didCopyLink? "Copied!": "Copy to clipboard"}>
                        <Button color="primary" onClick={()=>{
                            navigator.clipboard.writeText(window.location.href)
                            setDidCopyLink(true)
                            }}>Copy</Button>
                        </Tooltip>}}
                    />
                    <Typography variant="h3">Waiting for opponent to connect..</Typography>
                    <Board gameBoard={gameBoard[0]} onSquareChange ={(row,col,val) =>{return}}/>
                    <Typography variant="h3">{context.myName}</Typography>
                    </div>
                </div>
            :
                <div className="container">
                    <Popup trigger={openPopup} disableTrigger={()=>{setOpenPopup(false)}}>
                        <Typography variant="h3">Game over.</Typography>
                        <Typography variant="h1" style={{fontWeight: "bold", marginBottom:"20px"}}>{gameLoserIsA===null?"It's a draw.": gameLoserIsA===isPlayerA?"You lost.":"You won!"}</Typography>
                        <section>
                            <img style={{margin: "auto", display: "flex"}} className={gameLoserIsA===null?"draw": (gameLoserIsA===isPlayerA?"loser":"winner")} src={isPlayerA?avatarA:avatarB} alt="Your Avatar" />
                            <Typography style={{margin: "auto", display: "flex"}} display="inline" variant="h4">{context.myName}</Typography>
                            <img style={{margin: "auto", display: "flex"}} className={gameLoserIsA===null?"draw": (gameLoserIsA!==isPlayerA?"loser":"winner")} src={!isPlayerA?avatarA:avatarB} alt="Opponent's Avatar" />
                            <Typography style={{margin: "auto", display: "flex"}} display="inline" variant="h4">{context.oppName}</Typography>
                        </section>
                        {props.isCreator? 
                            <>
                            <Slider
                                value={gameDifficulty}
                                aria-labelledby="difficulty"
                                step={1}
                                min={17}
                                max={67}
                                marks={[{value:17,label: "Impossible"}, {value:67,label:"Very easy"}]}
                                valueLabelDisplay="auto"
                                onChange={handleDifficultyChange}
                            />
                            <Slider
                                value={gameDuration} 
                                aria-labelledby="time"
                                step={30}
                                min={60}
                                max={900}
                                marks={[{value:60,label: "1 minute"}, {value:900,label:"15 minutes"}]}
                                track={false}
                                valueLabelDisplay="auto"
                                valueLabelFormat={value => <div>{(String(Math.floor(value/60))<10?"0":"")+String(Math.floor(value/60))+":"+String(value%60)+(String(value%60)<10?"0":"")}</div>}
                                onChange={handleDurationChange}
                            />
                            </>
                            :
                            <></>
                        }
                        <Typography variant="h4">Play again?</Typography>
                        <Button 
                            variant="contained" 
                            disabled={didReqRematch}
                            color="primary" 
                            style={{margin: '0 auto', display: "flex"}}
                            onClick={handleRematchClick}>Rematch</Button>
                    </Popup>
                    <div className="inner">
                    <Game key={gameCounter} gameCounter={gameCounter} initialBoard={gameBoard[0]} solvedBoard={gameBoard[1]} isPlayerA={isPlayerA} 
                    id={gameid} timeInMs={gameDuration*1000} onGameOver={handleGamePageOver}/> 
                    {gameLoserIsA!==null?
                    <Button variant="outlined"
                    disabled={openPopup}
                    style={{marginTop: "20px"}}
                    onClick={()=>setOpenPopup(true)}>⟳</Button>
                    :<></>
                    }  
                    </div>
                </div>
            }
        </React.Fragment>
    )
}
