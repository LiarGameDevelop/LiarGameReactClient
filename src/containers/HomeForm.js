import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { makeRoom, enterRoom } from '../modules/room'
import Home from '../components/HomeUI';

const HomeForm = ({ }) => {
    const dispatch = useDispatch();
    const { connectionInfo } = useSelector(({ room }) => {
      return { connectionInfo: room.connectionInfo }
    });

    const navigate = useNavigate();

    const createRoom = () => {
        navigate("/game");
        console.log("create game: ", connectionInfo);
        dispatch(makeRoom(
            { "maxPersonCount": 5, "roomName": "front-room!", "ownerName":"heo"}
        ));
    }

    const enterExisting = () => {
        navigate("/game");
        console.log("enter game: ", connectionInfo);
        dispatch(enterRoom(
            { "roomId": roomCode, "userId":"so"}
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