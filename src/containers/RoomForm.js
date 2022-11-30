import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Room from '../components/RoomUI';

const RoomForm = () => {
    const roomNo = useParams().roomNo;
    const navigate = useNavigate();

    const leaveRoom = () => {
        console.log("should handle leave room");
        navigate("/");
    }

    return (
    <Room
        leaveRoom={leaveRoom}
    />
  );
};

export default RoomForm;