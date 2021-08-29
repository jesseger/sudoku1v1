import React from 'react'
import { v4 } from 'uuid'
import { Redirect, useParams } from 'react-router-dom'
import WaitingPage from './waitingpage.js'
const socket  = require('../connection/socket').socket //Our client socket

class EntryPage extends React.Component{
    state = {
        didGetUserName: false,
        userName: "",
        userInput: "" //button has to be disabled if empty
    }

    constructor(props){
        super(props);
        this.userInputField = React.createRef(); 
        this.gameID = null;
        this.handleUserInput = this.handleUserInput.bind(this);
        //this.createRoom = this.createRoom.bind(this);
    }

    createRoom(){
        //Create new gameID
        const newGameID = v4();
        console.log("newGameID: ", newGameID)

        //Store it
        this.gameID = newGameID;

        console.log("this.gameID: ", this.gameID)

        //Make server create new room
        socket.emit("createNewGame", newGameID);
        socket.emit("generateBoard", {gameID: this.gameID, difficulty: 61})
    }

    handleUserInput(e){
        this.setState({userInput: e.target.value})
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
                        <h2>Difficulty: </h2>
                        <h2>Time: </h2> 
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
                //return <Game initialBoard= "4.....8.5.3..........7......2.....6.....8.4......1.......6.3.7.5..2.....1.4......"/>
                return <WaitingPage isCreator={false} username={this.state.userName}/>
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