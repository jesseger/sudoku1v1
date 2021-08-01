import React from 'react'

export default function Square({value, onSquareChange}) {//redo this: pass only number. if . draw input, otherwise draw rect with number
    if(value==='.'){
        return (
            <input type="text" value="" maxLength="1" onChange={onSquareChange} />
        )
    }
    else{
        return (
            <label>{value}</label>
        )
    }
}