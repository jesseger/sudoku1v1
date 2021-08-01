//import { render } from '@testing-library/react';
import React from 'react';
import Board from './board.js';

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gameBoard: props.initialBoard,
            isPlayerANext: true
        };
        this.handleSquareChange=this.handleSquareChange.bind(this)
    }

    handleSquareChange(row, col, val) {
        console.log("Value: ", val);
        if(parseInt(val) >0 && parseInt(val) <=9){
            let idx=col+9*row;
            let newGrid=  this.state.gameBoard.substring(0,idx) + val + this.state.gameBoard.substring(idx+1);
            this.setState({gameBoard: newGrid,
            isPlayerANext: !this.state.isPlayerANext});
        }
    }


    render(){
        return <Board gameBoard={this.state.gameBoard} onSquareChange={this.handleSquareChange}/>
    }
}

export default Game