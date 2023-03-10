import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { deleteRoom } from '../modules/room'
import { connectStomp, disconnectStomp } from '../modules/stomp'
import RoomOwner from '../components/RoomOwnerUI';

const RoomForm = () => {
    const dispatch = useDispatch();
    const { connectionInfo, stompClient } = useSelector(({ room, stomp }) => {
        return { connectionInfo: room.connectionInfo, stompClient: stomp.stompClient }
    });
  

    const roomNo = useParams().roomNo;
    const navigate = useNavigate();

    const [numOfRound, setNumOfRound] = useState(5);
    const [numOfHint, setNumOfHint] = useState(1);

    const [category, setCategory] = useState("선택카테고리목록");

    useEffect(() => {
        console.log("connection info change ", connectionInfo);
        if(connectionInfo) {
            console.log("start connectStomp", connectionInfo);
            dispatch(connectStomp({connectionInfo}));
        }
      }, [connectionInfo]);

    // //Message Info
    // const [message, setMessage] = ('');
    // const [senderId, setSenderId] = ('');

    const leaveRoom = () => {
        console.log("leave room with sock client",stompClient)
        // if(connectionInfo) {
        //     console.log("should handle leave room", connectionInfo.roomId, connectionInfo.senderId);
        //     dispatch(deleteRoom({"roomId": connectionInfo.roomId, "ownerId": connectionInfo.senderId}));
        // }
        if(stompClient) {
            console.log("should disconnect socket");
            dispatch(disconnectStomp(stompClient));
        }
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