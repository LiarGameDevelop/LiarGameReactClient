import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getRoom, leaveRoom, deleteRoom } from '../modules/room'

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

    // const roomNo = useParams().roomNo; //아마 안쓰일듯
    const navigate = useNavigate();

    useEffect(() => {
        console.log("connection info change ", connectionInfo);
        if(connectionInfo) {
            connect();
        }
    }, [connectionInfo]);

    const [message, setMessage] = useState('');
    const [stompClient, setStompClient] = useState(null);
    const [phase, setPhase] = useState(0); // 0: 게임시작전, 1: 라운드 본인 턴 아님 2: 라운드 본인 턴 3: 투표 4: 투표 종료 5: 투표 결과 발표 6: 라이어 정답 맞추기 7: 게임 종료
    const [hints,setHints] = useState(['d','d','d','d','d','d']); //유저 별 힌트
    const [category, setCategory] = useState('');
    const [keyword, setKeyword] = useState('');
    const [turn, setTurn] = useState(null);
    const [liar, setLiar] = useState(null);
    const [round, setRound] = useState(0);
    const [mustAnswer, setMustAnswer] = useState(false); //라이어가 걸렸으면 정답 입력해야함
    const [answer, setAnswer] = useState(''); //라이어 입력 정답
    const [fuse, setFuse] = useState(0); //힌트, 투표, 정답 입력용 타이머 progress
    const [timer, setTimer] = useState(0); // 타이머
    const [chatlog, setChatlog] = useState([]);

    useEffect(() => {
        if(phase===2 || phase===3 || phase===6) {
            const t = setInterval(() => {
                setFuse((prevFuse) => {
                    if(prevFuse === 100) {
                        console.log("time up", t)
                        clearInterval(t);
                        return 0;
                    }
                    return (prevFuse + 1);
                })
            }, 200);
            console.log("set timer", t);
            setTimer(t);
        }
        else {
            console.log("clear timer ", timer)
            // clearInterval(timer);
            //TODO: interval 조정 좀 더 정교하게?
            const interval_id = window.setInterval(function(){}, Number.MAX_SAFE_INTEGER);
            // Clear any timeout/interval up to that id
            for (let i = 1; i < interval_id; i++) {
                window.clearInterval(i);
            }
            setFuse(0);
        }
    },[phase]);

    useEffect(() => {
        return () => {
            console.log("clear all interval")
            // Get a reference to the last interval + 1
            const interval_id = window.setInterval(function(){}, Number.MAX_SAFE_INTEGER);

            // Clear any timeout/interval up to that id
            for (let i = 1; i < interval_id; i++) {
                window.clearInterval(i);
            }
        }
    },[])

    const leaveTheRoom = () => {
        console.log("leave room")
        navigate("/");
        if(connectionInfo) {
            console.log("should handle leave room");
            dispatch(leaveRoom({ "roomId": connectionInfo.room.roomId, "userId": connectionInfo.user.userId, "token": connectionInfo.token.accessToken }));
            // dispatch(deleteRoom({"roomId": connectionInfo.room.roomId, "room.ownerId": connectionInfo.senderId}));
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

        stompClient.connect({"Authorization": `${connectionInfo.token.grantType} ${connectionInfo.token.accessToken}`}, function (frame) {
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
                fbody=JSON.parse(frame.body);
                let userIdx = -1;
                if(connectionInfo.user && connectionInfo.userList){
                    userIdx = connectionInfo.userList.findIndex((e)=>e.userId === fbody.senderId)
                }
                setChatlog((prevLog)=>([...prevLog, <p key={prevLog.length} id={`player${userIdx}`}>{userIdx === -1 ? '???' : connectionInfo.userList[userIdx].username}: {JSON.parse(frame.body).message}</p>]));
                if(fbody.type === "DESCRIPTION") {
                    // setHints((prevHints) => {
                    //     let target=prevHints[userIdx]
                    //     target = [...target,<p key={target.length}>{fbody.message}</p>];
                    //     prevHints[userIdx] = target;
                    //     console.log("set hints", prevHints)
                    //     return [...prevHints];
                    // })
                    setHints((prevHints) => {
                        prevHints[userIdx] += fbody.message;
                        console.log("set hints", prevHints)
                        return [...prevHints];
                    })
                }
            }, {"Authorization": `${connectionInfo.token.grantType} ${connectionInfo.token.accessToken}`});
    
            //사람 들어온것 =>웹소켓, STOMP 연결하면 자동으로 날라오는것.
            stompClient.subscribe(`/subscribe/room.login/${connectionInfo.room.roomId}`, function (frame) {
                console.info(`Someone entered in room id ${connectionInfo.room.roomId}`)
                dispatch(getRoom({ "roomId": connectionInfo.room.roomId, "token": connectionInfo.token.accessToken }));
            }, {"Authorization": `${connectionInfo.token.grantType} ${connectionInfo.token.accessToken}`});
    
            //사람 나간것
            stompClient.subscribe(`/subscribe/room.logout/${connectionInfo.room.roomId}`, function (frame) {
                console.info(`Someone left from room id ${connectionInfo.room.roomId}`)
                dispatch(getRoom({ "roomId": connectionInfo.room.roomId, "token": connectionInfo.token.accessToken }));
            }, {"Authorization": `${connectionInfo.token.grantType} ${connectionInfo.token.accessToken}`});
    
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
                    if(round===0 && connectionInfo.room.ownerId === connectionInfo.user.userId) {
                        console.log("SELECT_LIAR")
                        stompClient.send(`/publish/private/${connectionInfo.room.roomId}`, {}, JSON.stringify({
                            "senderId":connectionInfo.room.ownerId, 
                            "message":{"method":"selectLiar"},
                            "uuid":"a8f5bdc9-3cc7-4d9f-bde5-71ef471b9308"
                        }));
                    }
                    setHints(['','','','','','']);
                    setRound((prevRound) => prevRound + 1);
                }
                else if(fbody.message.method === "notifyTurn") {
                    setTurn(connectionInfo.userList.find((e)=> e.userId === fbody.message.body.turnId));
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
                    for(let i=0; i<connectionInfo.userList.length; ++i){
                        let userIdx = -1;
                        if(connectionInfo.user && connectionInfo.userList){
                            userIdx = connectionInfo.userList.findIndex((e)=>e.userId === fbody.message.body.liar)
                            setLiar(connectionInfo.userList[userIdx].userId)
                        }
                        if(connectionInfo.user.userId === fbody.message.body.liar) {
                            setMustAnswer(true);
                            setPhase(6);
                        }
                        if(connectionInfo.userList[i].userId === fbody.message.body.liar)
                        {
                            setLiar(connectionInfo.userList[i].userId);
                            if(connectionInfo.user.userId === fbody.message.body.liar) {
                                setMustAnswer(true);
                                setPhase(6);
                            }
                            break;
                        }
                    }
                }
                else if(fbody.message.method === "notifyLiarAnswerNeeded") {
                    console.log("라이어는 답을 말하라")

                }
                else if(fbody.message.method === "notifyLiarAnswerCorrect") {
                    setPhase(7)
                    if(fbody.message.body.answer) {
                        console.log("Liar is correct");
                    }
                    else {
                        console.log("liar is incorrect")
                    }
                    if(connectionInfo.room.ownerId === connectionInfo.user.userId) {
                        stompClient.send(`/publish/private/${connectionInfo.room.roomId}`, {}, JSON.stringify({
                            "senderId":connectionInfo.room.ownerId, 
                            "message":{"method":"openScores", "body":null},
                            "uuid":"a8f5bdc9-3cc7-4d9f-bde5-71ef471b9308"
                        }));   
                    }  
                }
                else if(fbody.message.method === "notifyLiarAnswerTimeout") {
                    setPhase(7)
                    console.log("liar timeout")
                    if(connectionInfo.room.ownerId === connectionInfo.user.userId) {
                        stompClient.send(`/publish/private/${connectionInfo.room.roomId}`, {}, JSON.stringify({
                            "senderId":connectionInfo.room.ownerId, 
                            "message":{"method":"openScores", "body":null},
                            "uuid":"a8f5bdc9-3cc7-4d9f-bde5-71ef471b9308"
                        }));   
                    }  
                }
                else if(fbody.message.method === "notifyScores") {
                    console.log("scoreboard", fbody.message.body.scoreboard)
                }
                else if(fbody.message.method === "notifyRoundEnd") {
                    console.log("round end");
                    if(fbody.message.body.state = "BEFORE_ROUND" && connectionInfo.room.ownerId === connectionInfo.user.userId) {
                        stompClient.send(`/publish/private/${connectionInfo.room.roomId}`, {}, JSON.stringify({
                            "senderId":connectionInfo.room.ownerId, 
                            "message":{"method":"startRound", "body":null},
                            "uuid":"a8f5bdc9-3cc7-4d9f-bde5-71ef471b9308"
                        }));  
                    }
                    else if(fbody.message.body.state = "PUBLISH_RANKINGS" && connectionInfo.room.ownerId === connectionInfo.user.userId) {
                        stompClient.send(`/publish/private/${connectionInfo.room.roomId}`, {}, JSON.stringify({
                            "senderId":connectionInfo.room.ownerId, 
                            "message":{"method":"publishRankings", "body":null},
                            "uuid":"a8f5bdc9-3cc7-4d9f-bde5-71ef471b9308"
                        }));  
                    }
                }
                else if(fbody.message.method === "notifyRankingsPublished") {
                    console.log("rankingsPublished")
                }
                else if(fbody.message.method === "notifyGameEnd") {
                    console.log("game end")
                }
            }, {"Authorization": `${connectionInfo.token.grantType} ${connectionInfo.token.accessToken}`});

            stompClient.subscribe(`/subscribe/private/${connectionInfo.user.userId}`, function (frame) {
                console.log("subscribe each client", frame.body);
                fbody=JSON.parse(frame.body);
                if(fbody.message.method === "notifyLiarSelected")
                {
                    if(fbody.message.body.liar) {
                        setLiar(connectionInfo.user.userId);
                    }
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
                    setCategory(fbody.message.body.category)
                    setKeyword(fbody.message.body.keyword.length > 0 ? fbody.message.body.keyword : "LIAR");
                }
                else if(fbody.message.method === "notifyGameState") {
                    console.log("notifyGameState", fbody)
                }
            }, {"Authorization": `${connectionInfo.token.grantType} ${connectionInfo.token.accessToken}`});

            //에러 처리 위한 채널
            stompClient.subscribe(`/subscribe/errors`, function (frame) {
                console.log("subscribe errors",frame.body);
            }, {"Authorization": `${connectionInfo.token.grantType} ${connectionInfo.token.accessToken}`});
        })
        setStompClient(stompClient);
    }

    const startGame = () => {
        if(connectionInfo.room.roomId && connectionInfo.room.ownerId === connectionInfo.user.userId)
        {            
            stompClient.send(`/publish/private/${connectionInfo.room.roomId}`, {}, JSON.stringify({
                "senderId":connectionInfo.room.ownerId, 
                "message":{"method":"startGame", "body":{"round":2,"turn":2,"category":["food","sports"]}},
                "uuid":"a8f5bdc9-3cc7-4d9f-bde5-71ef471b9308"
            }));
            console.log("start game!");
        }
    }

    const sendMessage = () => {
        let messageType = "MESSAGE";
        if(turn && turn.userId === connectionInfo.user.userId) {
            console.log("send hint")
            messageType = "DESCRIPTION";
        }
            
        const m = {"message": message,"senderId": connectionInfo.user.userId, "type": messageType};
        if(connectionInfo.room.roomId) {
            stompClient.send(`/publish/messages/${connectionInfo.room.roomId}`, {}, JSON.stringify(m));
            setMessage('');
        }
    }

    const sendVote = (index) => {
        if(connectionInfo.room.roomId && connectionInfo.userList) {
            stompClient.send(`/publish/private/${connectionInfo.room.roomId}`, {}, JSON.stringify({
                "senderId":connectionInfo.user.userId, 
                "message":{"method":"voteLiar", "body": {"liar": connectionInfo.userList[index].userId}},
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
        members={connectionInfo ? connectionInfo.userList : []}
        phase={phase}
        category={category}
        keyword={keyword}
        round={round}
        turn={turn}
        hints={hints}
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