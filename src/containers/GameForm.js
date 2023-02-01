import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getRoom, leaveRoom } from '../modules/room'

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
        if(connectionInfo && connectionInfo.users) {
            console.log("start connectStomp", connectionInfo);
            // connect(); //socket connect
        }
        else if(connectionInfo) {
            dispatch(getRoom({ "roomId": connectionInfo.room.roomId, "token": connectionInfo.token.accessToken }));
            connect();
        }
    }, [connectionInfo]);

    const [message, setMessage] = useState('');
    const [stompClient, setStompClient] = useState(null);
    const [phase, setPhase] = useState(0); // 0: 게임시작전, 1: 라운드 본인 턴 아님 2: 라운드 본인 턴 3: 투표 4: 투표 종료 5: 투표 결과 발표 6: 라이어 정답 맞추기 7: 게임 종료
    // const [hints,setHints] = useState(['','','','','','']); //유저 별 힌트
    const [category, setCategory] = useState('');
    const [keyword, setKeyword] = useState('');
    const [turn, setTurn] = useState('');
    const [liar, setLiar] = useState(null);
    const [round, setRound] = useState(0);
    const [mustAnswer, setMustAnswer] = useState(false); //라이어가 걸렸으면 정답 입력해야함
    const [answer, setAnswer] = useState(''); //라이어 입력 정답
    const [fuse, setFuse] = useState(0); //힌트, 투표, 정답 입력용 타이머
    const [chatlog, setChatlog] = useState([]);

    useEffect(() => {
        if(phase===2 || phase===3 || phase===6) {
            const timer = setInterval(() => {
                console.log("fuse ", fuse)
                setFuse((prevFuse) => {
                    if(prevFuse === 100) {
                        console.log("time up")
                        clearInterval(timer);
                        return 0;
                    }
                    return (prevFuse + 1);
                })
            }, 200);
        }
    },[phase]);

    const leaveTheRoom = () => {
        console.log("leave room")
        navigate("/");
        if(connectionInfo) {
            console.log("should handle leave room");
            dispatch(leaveRoom({ "roomId": connectionInfo.room.roomId, "userId": connectionInfo.user.userId, "token": connectionInfo.token.accessToken }));
        }
        if(stompClient) {
            console.log("should disconnect socket");
            disconnect();
        }
    }

    const toResult = () => {
        console.log("leave room with sock client")
        if(connectionInfo) {
            console.log("should handle leave room", connectionInfo.room.roomId, connectionInfo.senderId);
            // dispatch(deleteRoom({"roomId": connectionInfo.room.roomId, "room.ownerId": connectionInfo.senderId}));
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

        stompClient.connect({"username":connectionInfo.user.username,"roomId":connectionInfo.room.roomId, "token": connectionInfo.token.accessToken}, function (frame) {
            // setConnected(true)
            console.log('Connected: ' + frame)
    
            console.info('_gconnectionInfo room id: ' + connectionInfo.room.roomId)

            let fbody; // frame JSON으로 처리할 변수
    
            setInterval(()=>{
                stompClient.send(`/publish/private/${connectionInfo.room.roomId}`, {}, JSON.stringify({
                    "senderId":connectionInfo.user.userId, 
                    "message":{"method":"getGameState"},
                    "uuid":"a8f5bdc9-3cc7-4d9f-bde5-71ef471b9308"
                }))
            }, 60000);

            //클라이언트끼리 대화
            stompClient.subscribe(`/subscribe/room/${connectionInfo.room.roomId}/chat`, function (frame) {
                console.log("subscribe chat", frame.body);
                // ToDo: 채팅 처리 연구. connect할 때의 chatlog 값을 기준으로 갱신이 되는 문제.
                let userIndex = -1;
                let username='?'
                // if(connectionInfo.user && connectionInfo.users){
                //     for(let i=0; i<connectionInfo.users.length; ++i){
                //         if(connectionInfo.users[i].userId === JSON.parse(frame.body).senderId)
                //         {
                //             userIndex=i;
                //             username=connectionInfo.users[i].username;
                //             break;
                //         }
                //     }
                // }
                setChatlog((prevLog)=>([...prevLog, <p id={`player${userIndex}`}>{username}: {JSON.parse(frame.body).message}</p>]))
            })
    
            //사람 들어온것 =>웹소켓, STOMP 연결하면 자동으로 날라오는것.
            stompClient.subscribe(`/subscribe/room.login/${connectionInfo.room.roomId}`, function (frame) {
                console.info(`Someone entered in room id ${connectionInfo.room.roomId}`)
            })
    
            //사람 나간것
            stompClient.subscribe(`/subscribe/room.logout/${connectionInfo.room.roomId}`, function (frame) {
                console.info(`Someone left from room id ${connectionInfo.room.roomId}`)
            })
    
            //게임서버랑 통신 =>방장:게임을 시작하고, 게임설정(카테고리 설정...)
            stompClient.subscribe(`/subscribe/public/${connectionInfo.room.roomId}`, function (frame) {
                console.log("subscribe public", frame.body);
                fbody=JSON.parse(frame.body);
                
                if(fbody.message.method === "notifyGameStarted") {
                    console.log("notifyGameStarted - start Round")
                    setPhase(1);
                    if(connectionInfo.room.ownerId === connectionInfo.user.userId) {
                        stompClient.send(`/publish/private/${connectionInfo.room.roomId}`, {}, JSON.stringify({
                            "senderId":connectionInfo.room.ownerId, 
                            "message":{"method":"startRound", "body":null},
                            "uuid":"a8f5bdc9-3cc7-4d9f-bde5-71ef471b9308"
                        }));  
                    }
                }
                else if(fbody.message.method === "notifyRoundStarted") {
                    console.log("notifyRoundStarted - start Round")
                    setRound((prevRound) => prevRound + 1);
                }
                else if(fbody.message.body && fbody.message.body.state === "SELECT_LIAR") {
                    console.log("SELECT_LIAR")
                    if(connectionInfo.room.ownerId === connectionInfo.user.userId) {
                        stompClient.send(`/publish/private/${connectionInfo.room.roomId}`, {}, JSON.stringify({
                            "senderId":connectionInfo.room.ownerId, 
                            "message":{"method":"selectLiar"},
                            "uuid":"a8f5bdc9-3cc7-4d9f-bde5-71ef471b9308"
                        }));
                    }
                }
                else if(fbody.message.method === "notifyTurn") {
                    setTurn(fbody.message.body.turnId);
                    if(fbody.message.body.turnId === connectionInfo.user.userId){
                        console.log("It's your turn!")
                        setPhase(2);
                    }
                }
                else if(fbody.message.method === "notifyTurnTimeout") {
                    console.log("turn end")
                    setPhase(1);
                }
                else if(fbody.message.method === "notifyFindingLiarEnd") {
                    console.log("finding liar end! start voting")
                    setPhase(3);
                }
                else if(fbody.message.method === "notifyVoteResult") {
                    console.log("voting end! notify result")
                    setPhase(4);
                    if(connectionInfo.room.ownerId === connectionInfo.user.userId) {
                        stompClient.send(`/publish/private/${connectionInfo.room.roomId}`, {}, JSON.stringify({
                            "senderId":connectionInfo.room.ownerId, 
                            "message":{"method":"openLiar", "body":null},
                            "uuid":"a8f5bdc9-3cc7-4d9f-bde5-71ef471b9308"
                        }));
                    }
                }
                else if(fbody.message.method === "notifyNewVoteNeeded") {
                    console.log("new vote needed")
                    setPhase(3);
                }
                else if(fbody.message.method === "notifyLiarOpened") {
                    console.log("notify liar opened")
                    setPhase(5);
                    // for(let i=0; i<connectionInfo.users.length; ++i){
                    //     if(connectionInfo.users[i].userId === fbody.message.body.liar)
                    //     {
                    //         setLiar(connectionInfo.users[i].username);
                    //         if(connectionInfo.user.userId === fbody.message.body.liar) {
                    //             setMustAnswer(true);
                    //             setPhase(6);
                    //         }
                    //         break;
                    //     }
                    // }
                }
                else if(fbody.message.method === "notifyLiarAnswerNeeded") {
                    console.log("라이어는 답을 말하라")

                }
                else if(fbody.message.method === "notifyLiarAnswerCorrect") {
                    if(fbody.message.body.answer) {
                        console.log("Liar is correct");
                    }
                    else {
                        console.log("liar is incorrect")
                    }
                }
            })

            stompClient.subscribe(`/subscribe/private/${connectionInfo.user.userId}`, function (frame) {
                console.log("subscribe each client", frame.body);
                fbody=JSON.parse(frame.body);
                if(fbody.message.method === "notifyLiarSelected")
                {
                    if(connectionInfo.room.ownerId === connectionInfo.user.userId) {
                        console.log("notifyLiarSelected - openKeyword")
                        stompClient.send(`/publish/private/${connectionInfo.room.roomId}`, {}, JSON.stringify({
                            "senderId":connectionInfo.room.ownerId, 
                            "message":{"method":"openKeyword", "body":null},
                            "uuid":"a8f5bdc9-3cc7-4d9f-bde5-71ef471b9308"
                        }));   
                    }     
                }
                else if(fbody.message.method === "notifyKeywordOpened") {
                    console.log("notifyGameState", fbody)
                    setCategory(fbody.message.category)
                    // if(fbody.message.keyword === "LIAR") {
                    //     setLiar(true);
                    // }
                    setKeyword(fbody.message.keyword);
                }
                else if(fbody.message.method === "notifyGameState") {
                    console.log("notifyGameState", fbody)
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
        if(connectionInfo.room.roomId && connectionInfo.room.ownerId === connectionInfo.user.userId)
        {            
            stompClient.send(`/publish/private/${connectionInfo.room.roomId}`, {}, JSON.stringify({
                "senderId":connectionInfo.room.ownerId, 
                "message":{"method":"startGame", "body":{"round":5,"turn":2,"category":["food","sports"]}},
                "uuid":"a8f5bdc9-3cc7-4d9f-bde5-71ef471b9308"
            }));
            console.log("start game!");
        }
    }

    const sendMessage = () => {
        const m = {"message": message,"senderId": connectionInfo.user.userId}
        if(connectionInfo.room.roomId) {
            stompClient.send(`/publish/messages/${connectionInfo.room.roomId}`, {}, JSON.stringify(m));
            setMessage('');
        }
    }

    // const submitHint = (hint) => { //hint 제출 API 전달받으면 본격적으로 작업
    //     if(connectionInfo.room.roomId) {
    //         console.log("submit Hint", hint);
    //         const tmp = [...hints];
    //         tmp[0] = hint;
    //         setHints(tmp);
    //     }
    // }

    const sendVote = (index) => {
        if(connectionInfo.room.roomId && connectionInfo.users) {
            stompClient.send(`/publish/private/${connectionInfo.room.roomId}`, {}, JSON.stringify({
                "senderId":connectionInfo.user.userId, 
                "message":{"method":"voteLiar", "body": {"liar": connectionInfo.users[index].userId}},
                "uuid":"a8f5bdc9-3cc7-4d9f-bde5-71ef471b9308"
            }));  
        }
    }

    const submitAnswer = () => {
        if(connectionInfo.room.roomId) {
            stompClient.send(`/publish/private/${connectionInfo.room.roomId}`, {}, JSON.stringify({
                "senderId":connectionInfo.user.userId, 
                "message":{"method":"checkKeywordCorrect", "body": {"keyword": answer}},
                "uuid":"a8f5bdc9-3cc7-4d9f-bde5-71ef471b9308"
            }));  
        }
        setMustAnswer(false);
    }

    const disconnect = () => {
        if(stompClient) {
            stompClient.disconnect();
        }
    }
    //socket-end

    return (
    <Game
        isOwner={connectionInfo && connectionInfo.room.ownerId === connectionInfo.user.userId}
        startGame={startGame}
        leaveTheRoom={leaveTheRoom}
        toResult={toResult}
        members={members}
        phase={phase}
        // hints={hints}
        // submitHint={submitHint}
        category={category}
        keyword={keyword}
        round={round}
        turn={turn}
        sendVote={sendVote}
        liar={liar}
        mustAnswer={mustAnswer}
        answer={answer}
        setAnswer={setAnswer}
        submitAnswer={submitAnswer}
        fuse={fuse}
        message={message}
        setMessage={setMessage}
        sendMessage={sendMessage}
        chatlog={chatlog}
    />
    );
};

export default GameForm;