import React, { useRef, useState } from 'react'

export default function Square({value, onSquareChange}) {
    const [candidates, setCandidates] = useState({"1": false,"2":false,"3":false,"4":false,"5":false,"6":false,"7":false,"8":false,"9":false})
    const inputRef = useRef()

    function handleClick(e, index) {
        if(e.button===0){
            inputRef.current.focus()
            inputRef.current.click()
        }
        else{//Right-Click
            e.preventDefault()
            setCandidates({...candidates, [index]: !candidates[index]})
        }
    }

    if(value==='.'){
        return (
            <>
            <input ref={inputRef} type="text" value="" maxLength="1" onChange={onSquareChange} />
            <table className="candidates" cellPadding="0" cellSpacing="0">
            <tbody>
                {
                    [0,1,2].map((row) =>
                    <tr key={row}>
                        {
                            [0,1,2].map((col)=>
                                <td key={col} onClick={(e)=> handleClick(e, row*3+col +1)} onContextMenu={(e)=>handleClick(e, row*3+col +1)}>
                                    <span>{candidates[row*3+col +1]?row*3+col +1:""}</span>
                                </td>
                            )
                        }
                    </tr>
                    
                    )
                }

            </tbody>
            </table>
            </>
        )
    }
    else{
        return (
            <span>{value}</span>
        )
    }
}