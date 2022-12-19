import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { makeRoom } from '../modules/room'
import Home from '../components/HomeUI';

const HomeForm = ({ }) => {
    const dispatch = useDispatch();
    const { connectionInfo } = useSelector(({ room }) => {
      return { connectionInfo: room.connectionInfo }
    });

    const roomNo = useParams().roomNo;
    const navigate = useNavigate();

    const createRoom = () => {
        navigate("/room");
        console.log("enter room: ", connectionInfo);
        dispatch(makeRoom(
            { "maxPersonCount": 5, "roomName": "front-room!", "ownerName":"heo"}
        ));
    }
    const enterRoom = () => {
        navigate("/room");
        console.log("enter room: ", connectionInfo);
    }

    const [createNew,setCreateNew] = useState(false);
    const [openExisting,setOpenExisting] = useState(false);

    return (
    <Home
        createNew={createNew}
        setCreateNew={setCreateNew}
        openExisting={openExisting}
        setOpenExisting={setOpenExisting}
        createRoom={createRoom}
        enterRoom={enterRoom}
    />
    );
};

export default HomeForm;