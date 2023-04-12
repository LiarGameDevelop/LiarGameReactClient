import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { makeRoom, enterRoom } from '../modules/room'
import { connectStomp } from '../modules/stomp'
import { initializeForm, setGame } from '../modules/game';
import Home from '../components/HomeUI';

const HomeForm = ({ }) => {
    const dispatch = useDispatch();
    const { connectionInfo, stompClient } = useSelector(({ room, stomp }) => {
      return { connectionInfo: room.connectionInfo, stompClient: stomp.stompClient }
    });

    const navigate = useNavigate();

    useEffect(() => {
        console.log("initialize");
        dispatch(initializeForm("settings"));
        dispatch(initializeForm("result"));
    },[]);

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
        dispatch(setGame({
            "maxRound": state.maxRound, "maxHint": state.maxHint, "category": state.category,
        }))
        // navigate(`/game/${connectionInfo.room.roomId}`);
    }

    const enterExisting = () => {
        console.log("enter game: ", connectionInfo);
        dispatch(enterRoom(
            { "roomId": state.roomCode, "username": state.nickname, "password": "ebb9084e-a0ab-11ed-a8fc-0242ac120002"}
        ));
        // navigate(`/game/${connectionInfo.room.roomId}`);
    }

    const selectCategory = (t) => {
        const idx = state.category.findIndex((e)=>e===t);
        if(idx<0) {
            setState({...state, category : [...state.category, t]});
        }
        else {
            setState({...state, category : [...state.category.slice(0,idx), ...state.category.slice(idx+1) ]});
        }
    }

    const [state, setState] = useState({
        createNew: false,
        openHelp: false,
        nickname: '',
        roomCode: '',
        maxPersonCount: 3,
        maxRound: 1,
        maxHint: 1,
        category: [],
    })

    return (
    <Home
        createRoom={createRoom}
        enterExisting={enterExisting}
        state={state}
        setState={setState}
        selectCategory={selectCategory}
    />
    );
};

export default HomeForm;