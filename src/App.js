import './App.css';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import React, { useState } from 'react';
import EntryPage from './connection/entrypage.js';
import GamePage from './connection/gamepage.js';
import { createTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { GameContext } from './context';

const colorTheme = createTheme({
  palette: {
    primary: {
      main: '#23B5D3',
    },
    secondary: {
      main: '#75ABBC',
    },
    contrastThreshold: 3,
    tonalOffset: 0.2,
  },
  typography: {
    fontFamily: 'Roboto'
  },
  button:{
    color: 'secondary'
  }
});

function App() {
  const [didRedirect, setDidRedirect] = useState(false)
  const [userName, setUserName] = useState('')
  const [opponentName, setOpponentName] = useState('') 

  return(  
      <GameContext.Provider value = {{myName: userName, oppName: opponentName, setMyName: setUserName, setOppName: setOpponentName}}> 
      <ThemeProvider theme={colorTheme}>
      <Router>
        <Switch>
          <Route path = "/" exact>
            <EntryPage setDidRedirect={setDidRedirect} isCreator={true}/>
          </Route>
          <Route path = "/game/:gameid" exact>
            {didRedirect ? 
              <GamePage isCreator={true}/>
              :
              <EntryPage setDidRedirect={setDidRedirect} isCreator={false}/>
            }
          </Route>
          <Redirect to = "/" />
        </Switch>
      </Router>
      </ThemeProvider>
      </GameContext.Provider>
  )
}

export default App;
