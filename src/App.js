import logo from './logo.svg';
import './App.css';
import Game from './sudoku/game.js';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import React, { useState } from 'react';
import EntryPage from './connection/entrypage.js';
import WaitingPage from './connection/waitingpage.js';

function App() {
  //Page has to be changed on redirect and on button click in EntryPage
  const [didRedirect, setDidRedirect] = React.useState(false)
  const [userName, setUserName] = React.useState('')
  

  //const initialBoard = "4.....8.5.3..........7......2.....6.....8.4......1.......6.3.7.5..2.....1.4......";

  /*return (
    <Game initialBoard= "4.....8.5.3..........7......2.....6.....8.4......1.......6.3.7.5..2.....1.4......"/>
  )*/

  return(  
      <Router>
        <Switch>
          <Route path = "/" exact>
            <EntryPage setUserName={setUserName} setDidRedirect={setDidRedirect} isCreator={true}/>
          </Route>
          <Route path = "/game/:gameid" exact>
            {didRedirect ? 
              //<Game initialBoard= "4.....8.5.3..........7......2.....6.....8.4......1.......6.3.7.5..2.....1.4......"/>
              <WaitingPage isCreator={true} username={userName} />
              :
              <EntryPage setUserName={setUserName} setDidRedirect={setDidRedirect} isCreator={false}/>
            }
          </Route>
          <Redirect to = "/" />
        </Switch>
      </Router>
  )
}

export default App;
