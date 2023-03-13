import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { makeRoom, enterRoom } from '../modules/room'
import { connectStomp } from '../modules/stomp'
import Home from '../components/HomeUI';

const HomeForm = ({ }) => {
    const dispatch = useDispatch();
    const { connectionInfo, stompClient } = useSelector(({ room, stomp }) => {
      return { connectionInfo: room.connectionInfo, stompClient: stomp.stompClient }
    });

    const navigate = useNavigate();

    useEffect(() => {
        if(connectionInfo) {
            try{
                localStorage.setItem('connectionInfo',JSON.stringify(connectionInfo));
            }
            catch {
                console.log("localStorage set connectionInfo fail")
            }
            // dispatch(connectStomp({connectionInfo}));
            navigate(`/game/${connectionInfo.room.roomId}`);
        }
    }, [connectionInfo]);

    // useEffect(() => {
    //     console.log("stompClient set", stompClient);
    //     if(stompClient) {
    //         try{
    //             localStorage.setItem('stompClient', stompClient);
    //         }
    //         catch {
    //             console.log("localStorage set stomp fail")
    //         }
    //         navigate(`/game/${connectionInfo.room.roomId}`);
    //     }
    // }, [stompClient]); 

    const createRoom = () => {
        console.log("create game: ", connectionInfo);
        dispatch(makeRoom(
            { "maxPersonCount": state.maxPersonCount, "ownerName": state.nickname, "password": "ebb9084e-a0ab-11ed-a8fc-0242ac120002" }
        ));
        // navigate(`/game/${connectionInfo.room.roomId}`);
    }

    const enterExisting = () => {
        console.log("enter game: ", connectionInfo);
        dispatch(enterRoom(
            { "roomId": state.roomCode, "username": state.nickname, "password": "ebb9084e-a0ab-11ed-a8fc-0242ac120002"}
        ));
        // navigate(`/game/${connectionInfo.room.roomId}`);
    }

    const [state, setState] = useState({
        createNew: false,
        openHelp: false,
        nickname: '',
        roomCode: '',
        maxPersonCount: 3,
        maxRound: 1,
        maxHint: 1,
    })

    return (
    <Home
        createRoom={createRoom}
        enterExisting={enterExisting}
        state={state}
        setState={setState}
    />
    );
};

export default HomeForm;