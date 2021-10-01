import React from 'react'
import { v4 } from 'uuid'
import { Redirect, useParams } from 'react-router-dom'
import GamePage from './gamepage.js'
import { Button, Typography, Input, Slider } from '@material-ui/core';
import { GameContext } from '../context';
const socket  = require('../connection/socket').socket //Our client socket

class EntryPage extends React.Component{
    state = {
        didGetUserName: false,
        userName: "",
        userInput: "", 
        difficulty: 50,
        timeInSeconds: 300
    }

    constructor(props){
        super(props);
        this.userInputField = React.createRef(); 
        this.gameID = null;
        this.handleUserInput = this.handleUserInput.bind(this);
    }

    createRoom(){
        //Create new gameID
        const newGameID = v4();
        console.log("newGameID: ", newGameID)

        //Store it
        this.gameID = newGameID;

        console.log("this.gameID: ", this.gameID)

        //Make server create a new room
        socket.emit("createNewGame", {gameID: this.gameID, difficulty: this.state.difficulty, timeInSeconds: this.state.timeInSeconds});
    }

    //handleUserInput(e){
    handleUserInput = e => {
        this.setState({userInput: e.target.value})
    }

    handleDifficultyCommitted = (event, value) => {
        this.setState({difficulty: value});
    }

    handleTimeCommitted = (event, value) => {
        this.setState({timeInSeconds: value});
    }

    render(){
        if(this.props.isCreator){ //This is player 1
            if(this.state.didGetUserName){ 
                this.props.setDidRedirect(true)
                return <Redirect to = {"/game/" + this.gameID}></Redirect>
            }
            else{
                // Let player enter username and settings
                return(
                    <React.Fragment>
                        <div className="container">
                        <div style={{display: "flex", flexDirection: "column", justifyContent: "space-between", textAlign: "center"}}>
                        <Typography variant="h3">Please enter your username:</Typography>
                        <Input placeholder="Username" ref={this.userInputField} onChange = {this.handleUserInput} inputProps={{ 'aria-label': 'description' }} fullWidth={true} />
                        <Typography variant="h3">Difficulty:</Typography>  
                        <Slider
                        defaultValue={50}
                        aria-labelledby="difficulty"
                        step={1}
                        min={17}
                        max={67}
                        marks={[{value:17,label: "Impossible"}, {value:67,label:"Very easy"}]}
                        valueLabelDisplay="auto"
                        onChangeCommitted={this.handleDifficultyCommitted}
                        />
                        <Typography variant="h3">Time per person:</Typography>
                        <Slider
                        defaultValue={300}
                        aria-labelledby="time"
                        step={30}
                        min={60}
                        max={900}
                        marks={[{value:60,label: "1 minute"}, {value:900,label:"15 minutes"}]}
                        track={false}
                        valueLabelDisplay="auto"
                        valueLabelFormat={value => <div>{(String(Math.floor(value/60))<10?"0":"")+String(Math.floor(value/60))+":"+String(value%60)+(String(value%60)<10?"0":"")}</div>}
                        onChangeCommitted={this.handleTimeCommitted}
                        />
                        <Button 
                        variant="contained"
                        color="primary"
                        disabled ={!(this.state.userInput.length > 0)} 
                        onClick ={() =>{
                            this.createRoom()
                            var newUsername = this.state.userInput
                            this.context.setMyName(newUsername) 
                            this.setState({didGetUserName: true}) 
                        }}
                        style={{margin: '0 auto', display: "flex"}}
                        >Create Game</Button>
                        </div>
                        </div>
                    </React.Fragment>
                )
            }
        }

        else{//This is player 2
            if(this.state.didGetUserName){
                return <GamePage isCreator={false} username={this.state.userName}/>
            }
            else{
                // Let player type in name
                return( 
                    <div className="container"> 
                        <div className="inner"> 
                        <Typography variant="h3">Please enter your username:</Typography>
                        <Input placeholder="Username" ref={this.userInputField} onChange = {this.handleUserInput} inputProps={{ 'aria-label': 'description' }} fullWidth={true}/>
                        <Button 
                        variant="contained"
                        color="primary"
                        disabled ={!(this.state.userInput.length > 0)} 
                        onClick ={() =>{
                            const {joiningGameID} = this.props.params
                            this.gameID = joiningGameID
                            
                            var newUsername = this.state.userInput
                            this.context.setMyName(newUsername) 
                            this.setState({didGetUserName: true})
                        }}
                        style={{margin: '0 auto', marginTop:'10px', display: "flex"}}
                        >Join Game</Button>
                        </div>
                    </div>
                )
            }
        }
    }
}
EntryPage.contextType = GameContext;

//Can only use useParams hook in functional component 
export default (props) => (
    <EntryPage
        {...props}
        params={useParams()}
    />
);