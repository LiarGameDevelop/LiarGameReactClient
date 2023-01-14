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

    const [message, setMessage] = useState('');
    const [stompClient, setStompClient] = useState(null);
    const [chatlog, setChatlog] = useState([<p>공지: Test</p>,<p>공지: ㅆㅆ</p>])

    const leaveTheRoom = () => {
        console.log("leave room with sock client")
        if(connectionInfo) {
            console.log("should handle leave room", connectionInfo.roomId, connectionInfo.senderId);
            dispatch(leaveRoom({ "roomId": connectionInfo.roomId, "userId": "so" }));
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
    
    const connect = () => {
        if(!connectionInfo) {
            console.log("no connection info");
            return;
        }
        const socketEndPoint = `${process.env.REACT_APP_HOST}/ws-connection`
        const socket = new SockJS(socketEndPoint);
        let stompClient = Stomp.over(socket);

        console.log("try connect",connectionInfo);

        stompClient.connect({"username":connectionInfo.userList[0].username,"roomId":connectionInfo.roomId}, function (frame) {
            // setConnected(true)
            console.log('Connected: ' + frame)
    
            console.info('_gconnectionInfo room id: ' + connectionInfo.roomId)

            let fbody; // frame JSON으로 처리할 변수
    
            //클라이언트끼리 대화
            stompClient.subscribe(`/subscribe/room/${connectionInfo.roomId}/chat`, function (frame) {
                console.log("subscribe chat", frame.body);
                // ToDo: 채팅 처리 연구. connect할 때의 chatlog 값을 기준으로 갱신이 되는 문제.
                // let userIndex = -1;
                // let username='?'
                // if(connectionInfo.user && connectionInfo.userList){
                //     for(let i=0; i<connectionInfo.userList.length; ++i){
                //         if(connectionInfo.userList[i].userId == JSON.parse(frame.body).senderId)
                //         {
                //             userIndex=i;
                //             username=connectionInfo.userList[i].username;
                //             break;
                //         }
                //     }
                // }
                // setChatlog(([...chatlog, <p id={`player${userIndex}`} >{username}: {JSON.parse(frame.body).message}</p>]))
            })
    
            //사람 들어온것 =>웹소켓, STOMP 연결하면 자동으로 날라오는것.
            stompClient.subscribe(`/subscribe/room.login/${connectionInfo.roomId}`, function (frame) {
                console.info(`Someone entered in room id ${connectionInfo.roomId}`)
            })
    
            //사람 나간것
            stompClient.subscribe(`/subscribe/room.logout/${connectionInfo.roomId}`, function (frame) {
                console.info(`Someone left from room id ${connectionInfo.roomId}`)
            })
    
            //게임서버랑 통신 =>방장:게임을 시작하고, 게임설정(카테고리 설정...)
            stompClient.subscribe(`/subscribe/public/${connectionInfo.roomId}`, function (frame) {
                console.log("subscribe host", frame.body);
                fbody=JSON.parse(frame.body);
                if(connectionInfo.ownerId == connectionInfo.user.userId && fbody.message.method == "notifyGameStarted")
                {
                    console.log("notifyGameStarted - start Round")
                    stompClient.send(`/publish/private/${connectionInfo.roomId}`, {}, JSON.stringify({
                        "senderId":connectionInfo.ownerId, 
                        "message":{"method":"startRound", "body":null},
                        "uuid":"a8f5bdc9-3cc7-4d9f-bde5-71ef471b9308"
                    }));                    
                }
            })

            //에러 처리 위한 채널
            stompClient.subscribe(`/subscribe/errors`, function (frame) {
                console.log("subscribe errors",frame.body);
            })
        })
        setStompClient(stompClient);
    }

    const startGame = () => {
        if(connectionInfo.roomId && connectionInfo.ownerId == connectionInfo.user.userId)
        {            
            stompClient.send(`/publish/private/${connectionInfo.roomId}`, {}, JSON.stringify({
                "senderId":connectionInfo.ownerId, 
                "message":{"method":"startGame", "body":{"round":5,"turn":2,"category":["food","sports"]}},
                "uuid":"a8f5bdc9-3cc7-4d9f-bde5-71ef471b9308"
            }));
            console.log("start game!");
        }
    }

    const sendMessage = () => {
        const m = {"message": message,"senderId": connectionInfo.user.userId}
        if(connectionInfo.roomId)
            stompClient.send(`/publish/messages/${connectionInfo.roomId}`, {}, JSON.stringify(m));
            setChatlog(([...chatlog, <p id={`player${connectionInfo.user.userId}`} >{connectionInfo.user.username}: {message}</p>]))
            setMessage('');
        
    }

    const disconnect = () => {
        if(stompClient) {
            stompClient.disconnect();
        }
    }
    //socket-end

    return (
    <Game
        isOwner={connectionInfo && connectionInfo.ownerId == connectionInfo.user.userId}
        startGame={startGame}
        leaveTheRoom={leaveTheRoom}
        toResult={toResult}
        members={members}
        message={message}
        setMessage={setMessage}
        sendMessage={sendMessage}
        chatlog={chatlog}
    />
    );
};

export default GameForm;