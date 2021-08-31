//import { render } from '@testing-library/react';
import React from 'react';
import { socket } from '../connection/socket.js';
import Board from './board.js';

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gameBoard: props.initialBoard, //generate Board
            isPlayerANext: true,
            gameOver: false
        };
        this.solvedBoard =""
        this.wrongIndex=-1
        this.handleSquareChange=this.handleSquareChange.bind(this)
    }

    componentDidMount(){
        this.solvedBoard = this.props.solvedBoard
        console.log(`Received ${this.props.initialBoard}, ${this.props.solvedBoard}`)
        socket.on('newOpponentMove', data =>{
            let idx=data.col+9*data.row;
            let boardAfterOppMove=  this.state.gameBoard.substring(0,idx) + data.val + this.state.gameBoard.substring(idx+1);
            this.wrongIndex = data.gameOver===true? idx : this.wrongIndex
            console.log("Wrong Index:", this.wrongIndex)
            this.setState({gameBoard: boardAfterOppMove, gameOver: data.gameOver,isPlayerANext: data.isPlayerANext}) //DEBUG: Make sure that isPlayerANext is updated properly
        })
    }

    handleSquareChange(row, col, val) {
        console.log("Value: ", val);
        if(!this.state.gameOver && (this.props.isPlayerA===this.state.isPlayerANext) && parseInt(val) >0 && parseInt(val) <=9 ){
            let idx=col+9*row;
            let boardAfterMove=  this.state.gameBoard.substring(0,idx) + val + this.state.gameBoard.substring(idx+1);
            let isPlayerANextAfterMove = !this.state.isPlayerANext
            let gameOverAfterMove = false
            
            this.setState({gameBoard: boardAfterMove, isPlayerANext: isPlayerANextAfterMove});
            
            if(!(this.solvedBoard[idx]===val)){ //Wrong guess
                this.wrongIndex=idx
                gameOverAfterMove = true
                this.setState({gameOver: gameOverAfterMove})
            }
            socket.emit('newMove',{
                gameID: this.props.id,
                row: row,
                col: col,
                val: val,
                isPlayerANext: isPlayerANextAfterMove,
                gameOver: gameOverAfterMove
            })
        }
    }


    render(){
        return( 
        <React.Fragment>
            <Board gameBoard={this.state.gameBoard} onSquareChange={this.handleSquareChange} wrongIndex={this.wrongIndex}/>
            {this.state.gameOver?
                this.props.isPlayerA===this.state.isPlayerANext?
                    <h2>{"Game over. You won!"}</h2>
                    :
                    <h2>{"Game over. Your opponent won."}</h2>
            :
            <h2>{(this.state.isPlayerANext===this.props.isPlayerA)? "It is your turn" : "It is your opponent's turn"}</h2>
            }
            
            <h2>{String(this.state.gameOver)}</h2>
            <h2>{this.wrongIndex}</h2>
        </React.Fragment>)
        
    }
}

export default Game