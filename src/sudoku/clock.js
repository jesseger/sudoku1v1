import { Button } from '@material-ui/core';
import React, { useState, useRef, useEffect } from 'react'
import Countdown, { zeroPad} from 'react-countdown';

export default function Clock(props) {
    const clockRef = useRef()
    props.refCallback(clockRef)
    return (
        <>
        <Countdown
        ref={clockRef}
        date={props.date}
        renderer={(props) => <div>{zeroPad(props.minutes)+":"+zeroPad(props.seconds)}</div>}
        autoStart={false}
        onComplete={props.onTimeOut}
        />
        </>
    )
}

