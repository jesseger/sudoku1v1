//import { render } from '@testing-library/react';
import { Button } from '@material-ui/core';
import React from 'react';
import { socket } from '../connection/socket.js';
import Board from './board.js';
import Clock from './clock.js'

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gameBoard: props.initialBoard, 
            isPlayerANext: true,
            gameLoser: null, //null,'A','B'
        };
        this.solvedBoard =this.props.solvedBoard
        this.wrongIndex=-1
        this.handleSquareChange=this.handleSquareChange.bind(this)
        this.setMyClockRef = this.setMyClockRef.bind(this)
        this.setOppClockRef = this.setOppClockRef.bind(this)
        this.myClock = null
        this.opponentClock = null 
        this.endTime = Date.now()+props.timeInMs //sets both clocks to the chosen time
        this.handleTimeOut= this.handleTimeOut.bind(this)
    }

    isDraw(){
        return !this.state.gameLoser && this.state.gameBoard===this.solvedBoard
    }

    setMyClockRef(ref){
        this.myClock = ref
    }

    setOppClockRef(ref){
        this.opponentClock = ref
    }

    componentDidMount(){
        if(this.props.isPlayerA){
            this.myClock.current.start()
        }
        else{
            this.opponentClock.current.start()
        }
        socket.on('newMove', data =>{
            if(data.isPlayerANext===this.props.isPlayerA){
                this.opponentClock.current.pause()
                this.myClock.current.start()
            }
            else{
                this.opponentClock.current.start()
                this.myClock.current.pause()
            }
            let idx=data.col+9*data.row;
            let boardAfterOppMove = this.state.gameBoard.substring(0,idx) + data.val + this.state.gameBoard.substring(idx+1);
            this.wrongIndex = data.gameLoser? idx : this.wrongIndex
            this.setState({gameBoard: boardAfterOppMove, gameLoser: data.gameLoser,isPlayerANext: data.isPlayerANext})
            if(data.gameLoser){
                this.handleGameOver(data.gameLoser)
            }
            else if(this.isDraw()){
                this.handleGameOver(null)
            }
        })
    }

    handleTimeOut(isMyTimer){
        this.handleGameOver((this.props.isPlayerA&&isMyTimer) || (!this.props.isPlayerA &&!isMyTimer)?'A':'B') //this is a wrong condition, I'm dumb as fuck
        if(isMyTimer){
            alert("You ran out of time!")
        }
    }

    handleGameOver(gameLoser){
        this.myClock.current.pause()
        this.opponentClock.current.pause()
        this.setState({gameLoser: gameLoser})
        console.log('Game is over')
    }

    handleSquareChange(row, col, val) {
        if(!this.state.gameLoser && !this.isDraw() && (this.props.isPlayerA===this.state.isPlayerANext) && parseInt(val) >0 && parseInt(val) <=9 ){
            let idx=col+9*row;
            let boardAfterMove=  this.state.gameBoard.substring(0,idx) + val + this.state.gameBoard.substring(idx+1);
            let isPlayerANextAfterMove = !this.state.isPlayerANext
            var gameLoserAfterMove = null

            this.setState({gameBoard: boardAfterMove, isPlayerANext: isPlayerANextAfterMove});
            
            if(!(this.solvedBoard[idx]===val)){ //Wrong guess
                this.wrongIndex=idx
                gameLoserAfterMove= this.props.isPlayerA? 'A':'B'
            }

            socket.emit('newMove',{
                gameID: this.props.id,
                row: row,
                col: col,
                val: val,
                isPlayerANext: isPlayerANextAfterMove,
                gameLoser: gameLoserAfterMove
            })
        }
    }


    render(){
        return( 
        <React.Fragment>
            <Clock refCallback={this.setOppClockRef} date={this.endTime} onTimeOut={() => this.handleTimeOut(false)}/>
            <Board gameBoard={this.state.gameBoard} onSquareChange={this.handleSquareChange} wrongIndex={this.wrongIndex}/>
            <Clock refCallback={this.setMyClockRef} date={this.endTime} onTimeOut={() => this.handleTimeOut(true)}/>

            {this.state.gameLoser?
                ((this.state.gameLoser==='A' && this.props.isPlayerA) || (this.state.gameLoser==='B' && !this.props.isPlayerA))?
                <>
                <h2>{"Game over. Your opponent won."}</h2>
                </>
                :
                <>
                <h2>{"Game over. You won!"}</h2>
                </>
            :
                this.isDraw()?
                <h2>{"Game over. The game was a draw!"}</h2>
                :
                <h2>{(this.state.isPlayerANext===this.props.isPlayerA)? "It is your turn" : "It is your opponent's turn"}</h2>
            }
        </React.Fragment>)
        
    }
}

export default Game