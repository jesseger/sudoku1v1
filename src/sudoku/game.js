import { Button } from '@material-ui/core';
import React from 'react';
import { socket } from '../connection/socket.js';
import { GameContext } from '../context.js';
import Board from './board.js';
import Clock from '../components/clock.js'

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gameBoard: props.initialBoard, 
            isPlayerANext: true,
            gameLoserIsA: null, //null,true, false
        };
        this.solvedBoard =props.solvedBoard
        this.wrongIndex=-1
        this.lastIndex=-1
        this.handleSquareChange=this.handleSquareChange.bind(this)
        this.myClock = React.createRef()
        this.opponentClock = React.createRef()
        this.endTime = Date.now()+props.timeInMs //sets both clocks to the chosen time
        this.handleTimeOut= this.handleTimeOut.bind(this)
        this.onNewMove = this.onNewMove.bind(this);
        this.onSurrender = this.onSurrender.bind(this);
    }

    isDraw(){
        return this.state.gameLoserIsA===null && this.state.gameBoard===this.solvedBoard
    }

    onNewMove(data) {
        if (data.isPlayerANext === this.props.isPlayerA) {
          this.opponentClock.current.pause();
          this.myClock.current.start();
          this.props.oppMoveSound()
          
        } else {
          this.opponentClock.current.start();
          this.myClock.current.pause();
          this.props.myMoveSound();
        }
        let idx = data.col + 9 * data.row;
        let boardAfterOppMove =
          this.state.gameBoard.substring(0, idx) +
          data.val +
          this.state.gameBoard.substring(idx + 1);
        this.lastIndex = idx;
        this.wrongIndex = data.gameLoserIsA!==null ? idx : this.wrongIndex;
        
        this.setState({
          gameBoard: boardAfterOppMove,
          gameLoserIsA: data.gameLoserIsA,
          isPlayerANext: data.isPlayerANext,
        });
        if (data.gameLoserIsA!==null || this.isDraw()) {
          this.handleGameOver(data.gameLoserIsA);
        }
      }
    
      onSurrender(data) {
        this.handleSurrender(data.loserIsPlayerA);
      }

    componentDidMount(){
        if(this.props.isPlayerA){
            this.myClock.current.start()
        }
        else{
            this.opponentClock.current.start()
        }
        socket.on('newMove', this.onNewMove);

        socket.on('surrender', this.onSurrender);
    }

    componentWillUnmount(){
        socket.off('newMove', this.onNewMove)
        socket.off('surrender', this.onSurrender)
    }

    handleTimeOut(isMyTimer){
        this.handleGameOver((this.props.isPlayerA&&isMyTimer) || (!this.props.isPlayerA &&!isMyTimer)?true:false)
    }

    handleGameOver(gameLoserIsA){
        this.myClock.current.pause()
        this.opponentClock.current.pause()
        this.setState(prevState => ({...prevState, gameLoserIsA: gameLoserIsA}))
        this.props.onGameOver(gameLoserIsA)
    }

    handleSurrender(gameLoserIsA){
        this.handleGameOver(gameLoserIsA)
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
                gameLoserAfterMove= this.props.isPlayerA? true:false
            }

            socket.emit('newMove',{
                gameID: this.props.id,
                row: row,
                col: col,
                val: val,
                isPlayerANext: isPlayerANextAfterMove,
                gameLoserIsA: gameLoserAfterMove
            })
        }
    }
    
    render(){
        return( 
        <React.Fragment>
            <Clock isWhite={!this.props.isPlayerA} name={this.context.oppName} ref={this.opponentClock} date={this.endTime} onTimeOut={() => this.handleTimeOut(false)}/>
            <Board gameBoard={this.state.gameBoard} onSquareChange={this.handleSquareChange} wrongIndex={this.wrongIndex} lastIndex={this.lastIndex}/>
            <Clock isWhite={this.props.isPlayerA} name={this.context.myName} ref={this.myClock} date={this.endTime} onTimeOut={() => this.handleTimeOut(true)}/>

            <Button
                style={{margin: '0 auto', display: "flex"}}
                disabled={this.state.gameLoserIsA!==null || this.isDraw()}
                variant="contained"
                color="primary"
                onClick={()=>{socket.emit('surrender', {gameID: this.props.id, loserIsPlayerA: this.props.isPlayerA})}}>Surrender</Button>
        </React.Fragment>)
        
    }
}
Game.contextType = GameContext

export default Game