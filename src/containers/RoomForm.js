import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { deleteRoom } from '../modules/room'
import RoomOwner from '../components/RoomOwnerUI';
import RoomAttendee from '../components/RoomAttendeeUI';

const RoomForm = () => {
    const dispatch = useDispatch();
    const { connectionInfo } = useSelector(({ room }) => {
        return { connectionInfo: room.connectionInfo }
    });
  

    const roomNo = useParams().roomNo;
    const navigate = useNavigate();

    const [numOfRound, setNumOfRound] = useState(5);
    const [numOfHint, setNumOfHint] = useState(1);

    const [category, setCategory] = useState("선택카테고리목록");

    // //Connection Info
    // const [maxPerson, setMaxPerson] = useState(10);
    // const [ownerId, setOwnerId] = useState(1);
    // // const [roomId, setRoomID]
    // const [person, setPerson] = useState(0);

    // //Message Info
    // const [message, setMessage] = ('');
    // const [senderId, setSenderId] = ('');

    const leaveRoom = () => {
        if(connectionInfo)
            console.log("should handle leave room", connectionInfo.roomId, connectionInfo.senderId);
            dispatch(deleteRoom({"roomId": connectionInfo.roomId, "ownerId": connectionInfo.senderId}));
        navigate("/");
    }

    const setRounds = (n) => {
        setNumOfRound(n);
        console.log(n);
    }

    const setHints = (n) => {
        setNumOfHint(n);
        console.log(n);
    }

    const handleCategory = (v) => {
        setCategory(v);
        console.log(v);
    }

    return (
    <RoomOwner
        leaveRoom={leaveRoom}
        roomNo={roomNo}
        category={category}
        setCategory={handleCategory}
        numOfRound={numOfRound}
        setRounds={(n)=>setRounds(n)}
        numOfHint={numOfHint}
        setHints={setHints}
    />
  );
};

export default RoomForm;