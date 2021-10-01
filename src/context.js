import { createContext } from 'react'

export const GameContext = createContext({myName: "", 
    oppName: "", 
    setMyName: ()=>{}, 
    setOppName: ()=>{}});