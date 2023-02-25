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
            dispatch(connectStomp({connectionInfo}));
        }
    }, [connectionInfo]);

    useEffect(() => {
        console.log("stompClient set", stompClient);
        if(stompClient) {
            try{
                localStorage.setItem('stompClient', stompClient);
            }
            catch {
                console.log("localStorage set stomp fail")
            }
            navigate(`/game/${connectionInfo.room.roomId}`);
        }
    }, [stompClient]); 

    const createRoom = () => {
        console.log("create game: ", connectionInfo);
        dispatch(makeRoom(
            { "maxPersonCount": 5, "ownerName": nickname, "password": "ebb9084e-a0ab-11ed-a8fc-0242ac120002"}
        ));
    }

    const enterExisting = () => {
        console.log("enter game: ", connectionInfo);
        dispatch(enterRoom(
            { "roomId": roomCode, "username": nickname, "password": "ebb9084e-a0ab-11ed-a8fc-0242ac120002"}
        ));
    }

    const [createNew,setCreateNew] = useState(false);
    const [openHelp, setOpenHelp] = useState(false);
    const [nickname, setNickname] = useState('');
    const [roomCode, setRoomCode] = useState('');

    return (
    <Home
        createNew={createNew}
        setCreateNew={setCreateNew}
        createRoom={createRoom}
        enterExisting={enterExisting}
        nickname={nickname}
        setNickname={setNickname}
        roomCode={roomCode}
        setRoomCode={setRoomCode}
        openHelp={openHelp}
        setOpenHelp={setOpenHelp}
    />
    );
};

export default HomeForm;