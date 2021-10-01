import { Box, Typography } from '@material-ui/core';
import React, { useState, forwardRef } from 'react'
import Countdown, { zeroPad } from 'react-countdown';

const Clock = (props,ref) => {
    const [paused, setPaused] = useState(true);
    return (
        <div style={{display: "flex", justifyContent: "space-between", marginTop: "5px", marginBottom: "2px", opacity: `${paused?0.2:1.0}`}}>
            <div style={{display: "inline-block"}}>
                <Typography style={{fontSize:30, fontWeight: "bold", fontStyle: "italic", display:"inline"}}>{props.name}</Typography>
            </div>

            <div style={{display: "inline-block"}}>
                <Box width={"10em"} border={3} borderRadius={5} borderColor="primary.main" sx={{display: 'flex', flexDirection: 'row-reverse', backgroundColor: props.isWhite?"white":"black"}}>
                    <div style={{align: "right"}}>
                    <Countdown
                    ref={ref}
                    date={props.date}
                    renderer={(timeProps) => <div style={{color: props.isWhite?'black':'white', fontSize:30, fontWeight:'bold', fontFamily: 'Roboto'}}>{zeroPad(timeProps.minutes)+":"+zeroPad(timeProps.seconds)}</div>}
                    autoStart={false}
                    onComplete={props.onTimeOut}
                    onPause={(timeProps)=>{setPaused(true)}}
                    onStart={(timeProps)=>setPaused(false)}
                    />
                    </div>
                </Box>
            </div>

        </div>
    )
}

export default forwardRef(Clock);
