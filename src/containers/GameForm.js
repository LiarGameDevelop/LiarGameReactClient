import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { leaveRoom } from '../modules/room'

//TODO: Socket 관련 코드는 별도 store로 옮기는걸로 장기적으로.
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
//
import Game from '../components/GameUI';

const GameForm = ({ }) => {
    const dispatch = useDispatch();
    const { connectionInfo } = useSelector(({ room }) => {
      return { connectionInfo: room.connectionInfo }
    });

    const roomNo = useParams().roomNo; //아마 안쓰일듯
    const navigate = useNavigate();

    const members = ["철수", "영희", "민수", "Jhon", "kevu", "mike" ]; //향후 server에서 받아올듯

    useEffect(() => {
        console.log("connection info change ", connectionInfo);
        if(connectionInfo) {
            console.log("start connectStomp", connectionInfo);
            connect(); //socket connect
        }
      }, [connectionInfo]);

    const leaveTheRoom = () => {
        console.log("leave room with sock client")
        if(connectionInfo) {
            console.log("should handle leave room", connectionInfo.roomId, connectionInfo.senderId);
            dispatch(leaveRoom({"roomId": connectionInfo.roomId, "userId": "so"}));
        }
        if(stompClient) {
            console.log("should disconnect socket");
            disconnect();
        }
        navigate("/");
    }

    const toResult = () => {
        console.log("leave room with sock client")
        if(connectionInfo) {
            console.log("should handle leave room", connectionInfo.roomId, connectionInfo.senderId);
            // dispatch(deleteRoom({"roomId": connectionInfo.roomId, "ownerId": connectionInfo.senderId}));
        }
        if(stompClient) {
            console.log("should disconnect socket");
            disconnect();
        }
        navigate("/result");
    }

    //socket-start
    const socketEndPoint = `${process.env.REACT_APP_HOST}/ws-connection`
    const socket = new SockJS(socketEndPoint);
    const stompClient = Stomp.over(socket);

    const connect = () => {
        if(!connectionInfo) {
            console.log("no connection info");
            return;
        }
        console.log("try connect",connectionInfo);

        stompClient.connect({"username":"chulsoo","roomId":connectionInfo.roomId}, function (frame) {
            // setConnected(true)
            console.log('Connected: ' + frame)
    
            console.info('_gconnectionInfo room id: ' + connectionInfo.roomId)
    
            //클라이언트끼리 대화
            stompClient.subscribe(`/subscribe/room/${connectionInfo.roomId}/chat`, function (frame) {
                addChat(frame.body)
            })
    
            //사람 들어온것 =>웹소켓, STOMP 연결하면 자동으로 날라오는것.
            stompClient.subscribe(`/subscribe/room.login/${connectionInfo.roomId}`, function (frame) {
                //addChat(greeting)
                console.info(`Someone entered in room id ${connectionInfo.roomId}`)
                addChat("entered:"+frame.body);
            })
    
            //사람 나간것
            stompClient.subscribe(`/subscribe/room.logout/${connectionInfo.roomId}`, function (frame) {
                console.info(`Someone left from room id ${connectionInfo.roomId}`)
                addChat("left:"+frame.body);
            })
    
            //게임서버랑 통신 =>방장:게임을 시작하고, 게임설정(카테고리 설정...)
            stompClient.subscribe(`/subscribe/system/private/${connectionInfo.roomId}`, function (frame) {
                addChat("gameserver :"+frame.body);
            })
        })
    }

    const addChat = (message) => {
        console.log('implement addChat', message);
    }

    const disconnect = () => {
        if(stompClient) {
            stompClient.disconnect();
        }
    }
    //socket-end

    return (
    <Game
        leaveTheRoom={leaveTheRoom}
        toResult={toResult}
        members={members}
    />
    );
};

export default GameForm;