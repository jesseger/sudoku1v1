import React from 'react'
import { v4 } from 'uuid'
import { Redirect, useParams } from 'react-router-dom'
import GamePage from './gamepage.js'
import Slider from '@material-ui/core/Slider'
const socket  = require('../connection/socket').socket //Our client socket

class EntryPage extends React.Component{
    state = {
        didGetUserName: false,
        userName: "",
        userInput: "", //button has to be disabled if empty
        difficulty: 40,
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

        //Make server create new room
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
                // Let player type in name
                return(
                    <React.Fragment>
                        <h1>Type in your username:</h1>
                        <input type="text" value={this.state.userInput} ref={this.userInputField} onChange = {this.handleUserInput}/>
                        <h2 id="difficulty">Difficulty: </h2>
                        <Slider
                        defaultValue={40}
                        aria-labelledby="difficulty"
                        step={1}
                        min={17}
                        max={67}
                        marks={[{value:17,label: "Impossible"}, {value:67,label:"Very easy"}]}
                        valueLabelDisplay="auto"
                        style={{width: 200, marginLeft:200}}
                        onChangeCommitted={this.handleDifficultyCommitted}
                        />
                        <h2 id="time">Time per person: </h2> 
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
                        style={{width: 200, marginLeft:200}}
                        onChangeCommitted={this.handleTimeCommitted}
                        />
                        <button 
                        disabled = {!(this.state.userInput.length > 0)} 
                        onClick ={() =>{
                            this.createRoom()
                            
                            var newUsername = this.state.userInput
                            this.props.setUserName(newUsername) //This shouldn't rerender EntryPage, so maybe pass setUserName as Callback
                            this.setState({didGetUserName: true, userName: newUsername})
                            console.log("EntryPage.state.userName: ",this.state.userName) 
                        }}> Create Game </button>
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
                return( //DEBUG Fragment instead of div
                    <div /*className="container"*/> 
                        <h1 style={{textAlign: "center", marginTop: String((window.innerHeight / 3)) + "px"}}>Type in your username:</h1>
                        <input type="text" value={this.state.userInput} ref={this.userInputField} onChange = {this.handleUserInput}/>
        
                        <button 
                        disabled = {!(this.state.userInput.length > 0)}
                        onClick ={() =>{
                            const {joiningGameID} = this.props.params
                            this.gameID = joiningGameID
                            
                            var newUsername = this.state.userInput
                            this.props.setUserName(newUsername) //This shouldn't rerender EntryPage, so maybe pass setUserName as Callback
                            this.setState({didGetUserName: true, userName: newUsername})
                            console.log("EntryPage.state.userName: ",this.state.userName)
                        }}> Create Game </button>
                    </div>
                )
            }
        }
    }
}

//Can only use useParams hook in functional component 
export default (props) => (
    <EntryPage
        {...props}
        params={useParams()}
    />
);