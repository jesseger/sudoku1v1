import Square from './square.js';
import React from 'react'

export default function board({ gameBoard, onSquareChange }) {
    return (
        <table>
        <tbody>
            {
                [...Array(9).keys()].map((row) =>
                    <tr key={row}>
                        {
                            [...Array(9).keys()].map((col)=>
                                <td>
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
