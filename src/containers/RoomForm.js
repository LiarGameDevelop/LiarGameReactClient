import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { deleteRoom } from '../modules/room'
import Room from '../components/RoomUI';

const RoomForm = () => {
    const dispatch = useDispatch();
    const { connectionInfo } = useSelector(({ room }) => {
        return { connectionInfo: room.connectionInfo }
    });
  

    const roomNo = useParams().roomNo;
    const navigate = useNavigate();

    // //Connection Info
    // const [maxPerson, setMaxPerson] = useState(10);
    // const [ownerId, setOwnerId] = useState(1);
    // // const [roomId, setRoomID]
    // const [person, setPerson] = useState(0);

    // //Message Info
    // const [message, setMessage] = ('');
    // const [senderId, setSenderId] = ('');

    const leaveRoom = () => {
        console.log("should handle leave room", connectionInfo.roomId, connectionInfo.senderId);
        if(connectionInfo)
            dispatch(deleteRoom({"roomId": connectionInfo.roomId, "ownerId": connectionInfo.senderId}));
        navigate("/");
    }

    return (
    <Room
        leaveRoom={leaveRoom}
        roomNo={roomNo}
    />
  );
};

export default RoomForm;