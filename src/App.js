import logo from './logo.svg';
import './App.css';
import Game from './sudoku/game.js';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import React, { useState } from 'react';
import EntryPage from './connection/entrypage.js';
import GamePage from './connection/gamepage.js';

function App() {
  //Page has to be changed on redirect and on button click in EntryPage
  const [didRedirect, setDidRedirect] = React.useState(false)
  const [userName, setUserName] = React.useState('')

  return(  
      <Router>
        <Switch>
          <Route path = "/" exact>
            <EntryPage setUserName={setUserName} setDidRedirect={setDidRedirect} isCreator={true}/>
          </Route>
          <Route path = "/game/:gameid" exact>
            {didRedirect ? 
              <GamePage isCreator={true} username={userName} />
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
