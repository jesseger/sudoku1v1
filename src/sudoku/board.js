import Square from './square.js';
import React from 'react'

export default function board({ gameBoard, onSquareChange }) {
    return (
        <table className="sudokuboard">
        <tbody>
            {
                [...Array(9).keys()].map((row) =>
                    <tr key={row}>
                        {
                            [...Array(9).keys()].map((col)=>
                                <td key={col}>
                                    <Square value={gameBoard.charAt(col+row*9)} onSquareChange={(e) => (onSquareChange(row, col, e.target.value))} />
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
