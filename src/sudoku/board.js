import Square from './square.js';
import React, { useEffect, useState } from 'react'

export default function board({ gameBoard, onSquareChange, wrongIndex }) {
    return (
        <table className="sudokuboard">
        <tbody>
            {
                [...Array(9).keys()].map((row) =>
                    <tr key={row}>
                        {
                            [...Array(9).keys()].map((col)=>
                                <td key={col} className={wrongIndex===col+row*9? 'wrongCell' : 'correctCell'}>
                                    <Square value={gameBoard.charAt(col+row*9)} onSquareChange={(e) => (onSquareChange(row, col, e.target.value))}/>
                                </td>
                            )
                        }
                    </tr>
                )
            }
        </tbody>
        </table>
    )
}
