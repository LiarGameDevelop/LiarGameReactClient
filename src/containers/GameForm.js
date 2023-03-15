import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getRoom, leaveRoom } from '../modules/room'
import stomp, { connectStomp, disconnectStomp, subscribeStomp } from '../modules/stomp'
import Game from '../components/GameUI';

const GameForm = ({ }) => {
    const dispatch = useDispatch();
    const { connectionInfo, stompClient } = useSelector(({ room, stomp }) => {
      return { connectionInfo: room.connectionInfo, stompClient: stomp.stompClient }
    });

    const navigate = useNavigate();

    useEffect(() => {
        console.log("stompClient info change ", stompClient);
        if(stompClient)
            subscribe();
        // if(!stompClient) {
        //     dispatch(leaveRoom({ "roomId": connectionInfo.room.roomId, "userId": connectionInfo.user.userId, "token": connectionInfo.token.accessToken }));
        //     navigate("/");
        // }
    }, [stompClient]);

    const [state, setState] = useState({
        message : '',
        phase : 0, // 0: 게임시작전, 1: 라운드 본인 턴 아님 2: 라운드 본인 턴 3: 투표 4: 투표 종료 5: 투표 결과 발표 6: 라이어 정답 맞추기 7: 게임 종료
        hints : ['d','d','d','d','d','d'], //유저 별 힌트
        category : '',
        keyword : '',
        turn : null,
        liar : null,
        round : 0,
        mustAnswer : false,
        fuse : 0,
        chatlog : [],
    })

    useEffect(() => {
        dispatch(connectStomp({connectionInfo}));
        // subscribe();
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
        if(stompClient) {
            dispatch(disconnectStomp({stompClient}));
        }
        dispatch(leaveRoom());
        navigate("/");
    }

    const toResult = () => {
        console.log("leave room with sock client")
        if(connectionInfo) {
            console.log("should handle leave room", connectionInfo.room.roomId, connectionInfo.senderId);
            // dispatch(deleteRoom({"roomId": connectionInfo.room.roomId, "room.ownerId": connectionInfo.senderId}));
        }

        navigate("/result");
    }

    
    const subscribe = () => {
        if(!connectionInfo) {
            console.log("no connection info");
            return;
        }
        console.info('_gconnectionInfo room id: ' + connectionInfo.room.roomId)

        let fbody; // frame JSON으로 처리할 변수

        //클라이언트끼리 대화
        stompClient.subscribe(`/topic/room.${connectionInfo.room.roomId}.chat`, function (frame) {
            console.log("subscribe chat", frame.body);
            fbody=JSON.parse(frame.body);
            let userIdx = -1;
            if(connectionInfo.user && connectionInfo.userList){
                userIdx = connectionInfo.userList.findIndex((e)=>e.userId === fbody.senderId)
            }
            if(fbody.type === "DESCRIPTION") {
                setState((prevState) => ({ ...prevState,
                    hints: [...prevState.hints.slice(0,userIdx), prevState.hints[userIdx] + fbody.message + '\n', ...prevState.hints.slice(userIdx+1,prevState.hints.length)],
                    chatlog: [...prevState.chatlog, <p key={prevState.chatlog.length} id={`player${userIdx}`}>{userIdx === -1 ? '???' : connectionInfo.userList[userIdx].username}: {JSON.parse(frame.body).message}</p>],
                }));
            }
            else {
                setState((prevState) => ({ ...prevState,
                    chatlog: [...prevState.chatlog, <p key={prevState.chatlog.length} id={`player${userIdx}`}>{userIdx === -1 ? '???' : connectionInfo.userList[userIdx].username}: {JSON.parse(frame.body).message}</p>],
                }));
            }
        }, {"Authorization": `${connectionInfo.token.grantType} ${connectionInfo.token.accessToken}`});

        //사람 들어온것 =>웹소켓, STOMP 연결하면 자동으로 날라오는것.
        stompClient.subscribe(`/topic/room.${connectionInfo.room.roomId}.login`, function (frame) {
            
            console.info(`Someone entered`, frame.body)
            setState((prevState) => ({ ...prevState,
                chatlog: [...prevState.chatlog, <p key={prevState.chatlog.length}> [시스템]: 새로운 참가자가 입장했습니다.</p>],
            }));
            dispatch(getRoom({ "roomId": connectionInfo.room.roomId, "token": connectionInfo.token.accessToken }));
        }, {"Authorization": `${connectionInfo.token.grantType} ${connectionInfo.token.accessToken}`});

        //사람 나간것
        stompClient.subscribe(`/topic/room.${connectionInfo.room.roomId}.logout`, function (frame) {
            console.info(`Someone left from room id ${connectionInfo.room.roomId}`)
            dispatch(getRoom({ "roomId": connectionInfo.room.roomId, "token": connectionInfo.token.accessToken }));
        }, {"Authorization": `${connectionInfo.token.grantType} ${connectionInfo.token.accessToken}`});

        //게임서버랑 통신 =>방장:게임을 시작하고, 게임설정(카테고리 설정...)
        stompClient.subscribe(`/topic/room.${connectionInfo.room.roomId}.user.*`, function (frame) {
            console.log("subscribe public", frame.body);
            fbody=JSON.parse(frame.body);
            
            if(fbody.message.method === "notifyGameStarted") {
                console.log("notifyGameStarted - start Round")
                setState((prevState)=>({
                    ...prevState, phase:1, chatlog: [...prevState.chatlog, <p key={prevState.chatlog.length}> [시스템]: 게임이 시작되었습니다.</p>],
                }));
                if(connectionInfo.room.ownerId === connectionInfo.user.userId) {
                    stompClient.send(`/publish/private.${connectionInfo.room.roomId}`, {}, JSON.stringify({
                        "senderId":connectionInfo.room.ownerId, 
                        "message":{"method":"startRound", "body":null},
                        "uuid":"a8f5bdc9-3cc7-4d9f-bde5-71ef471b9308"
                    }));  
                }
            }
            else if(fbody.message.method === "notifyRoundStarted") {
                console.log("notifyRoundStarted - start Round")
                if(state.round===0 && connectionInfo.room.ownerId === connectionInfo.user.userId) {
                    console.log("SELECT_LIAR")
                    stompClient.send(`/publish/private.${connectionInfo.room.roomId}`, {}, JSON.stringify({
                        "senderId":connectionInfo.room.ownerId, 
                        "message":{"method":"selectLiar"},
                        "uuid":"a8f5bdc9-3cc7-4d9f-bde5-71ef471b9308"
                    }));
                }
                setState((prevState) => ({
                    ...prevState, hints: ['','','','','',''], liar: null, round: prevState.round +1,
                    chatlog: [...prevState.chatlog, <p key={prevState.chatlog.length}> [시스템]: {prevState.round +1}라운드를 시작합니다.</p>]
                })); 
            }
            else if(fbody.message.method === "notifyTurn") {
                let turn = connectionInfo.userList.find((e)=> e.userId === fbody.message.body.turnId);
                if(fbody.message.body.turnId === connectionInfo.user.userId) {
                    console.log("It's your turn!")
                    const t = setInterval(() => {
                        setState((prevState) => {
                            if(prevState.fuse === 100 || prevState.phase != 2){
                                console.log("end turn", t)
                                clearInterval(t);
                                return { ...prevState, fuse: 0 };;
                            }
                            return { ...prevState, fuse: prevState.fuse + 1 };
                        });
                    }, 200);
                    setState((prevState)=>({
                        ...prevState, phase:2, turn: turn,
                        chatlog: [...prevState.chatlog, <p key={prevState.chatlog.length}> [시스템]: {turn.username}의 턴.</p>],
                    }));
                }
                else {
                    setState((prevState)=>({
                        ...prevState, turn: turn,
                        chatlog: [...prevState.chatlog, <p key={prevState.chatlog.length}> [시스템]: {turn.username}의 턴.</p>],
                    }));
                }
            }
            else if(fbody.message.method === "notifyTurnTimeout") {
                console.log("turn end")
                setState((prevState)=>({ ...prevState, phase:1 }));
            }
            else if(fbody.message.method === "notifyFindingLiarEnd") {
                console.log("finding liar end! start voting")
                setState((prevState)=>({ ...prevState, phase:3 }));
            }
            else if(fbody.message.method === "notifyVoteResult") {
                console.log("voting end! notify result")
                setState((prevState)=>({ ...prevState, phase:4 }));
                if(connectionInfo.room.ownerId === connectionInfo.user.userId) {
                    stompClient.send(`/publish/private.${connectionInfo.room.roomId}`, {}, JSON.stringify({
                        "senderId":connectionInfo.room.ownerId, 
                        "message":{"method":"openLiar", "body":null},
                        "uuid":"a8f5bdc9-3cc7-4d9f-bde5-71ef471b9308"
                    }));
                }
            }
            else if(fbody.message.method === "notifyNewVoteNeeded") {
                console.log("new vote needed")
                setState((prevState)=>({ ...prevState, phase:3 }));
            }
            else if(fbody.message.method === "notifyLiarOpened") {
                console.log("notify liar opened")
                const t = setInterval(() => {
                    setState((prevState) => {
                        if(prevState.fuse === 100 || prevState.phase != 6){
                            console.log("end turn", t)
                            clearInterval(t);
                            return { ...prevState, fuse: 0 };;
                        }
                        return { ...prevState, fuse: prevState.fuse + 1 };
                    });
                }, 200);
                if(connectionInfo.user.userId === fbody.message.body.liar) {
                    if(fbody.message.body.matchLiar) {
                        setState((prevState)=>({
                            ...prevState, liar: fbody.message.body.liar, phase:6, mustAnswer: true,
                            chatlog: [...prevState.chatlog, <p key={prevState.chatlog.length}> [시스템]: 시민들이 라이어를 찾았습니다.</p>],
                        }));
                    }
                    else {
                        setState((prevState)=>({
                            ...prevState, liar: fbody.message.body.liar, phase:6, mustAnswer: true,
                            chatlog: [...prevState.chatlog, <p key={prevState.chatlog.length}> [시스템]: 시민들이 라이어를 찾지 못했습니다.</p>],
                        }));
                    }
                }
                else {
                    if(fbody.message.body.matchLiar) {
                        setState((prevState)=>({
                            ...prevState, liar: fbody.message.body.liar, phase:6,
                            chatlog: [...prevState.chatlog, <p key={prevState.chatlog.length}> [시스템]: 시민들이 라이어를 찾았습니다.</p>],
                        }));
                    }
                    else {
                        setState((prevState)=>({
                            ...prevState, liar: fbody.message.body.liar, phase:6,
                            chatlog: [...prevState.chatlog, <p key={prevState.chatlog.length}> [시스템]: 시민들이 라이어를 찾지 못했습니다.</p>],
                        }));
                    }                 
                }
            }
            else if(fbody.message.method === "notifyLiarAnswerCorrect") {
                if(fbody.message.body.answer) {
                    console.log("Liar is correct");
                }
                else {
                    console.log("liar is incorrect")
                }
                if(connectionInfo.room.ownerId === connectionInfo.user.userId) {
                    stompClient.send(`/publish/private.${connectionInfo.room.roomId}`, {}, JSON.stringify({
                        "senderId":connectionInfo.room.ownerId, 
                        "message":{"method":"openScores", "body":null},
                        "uuid":"a8f5bdc9-3cc7-4d9f-bde5-71ef471b9308"
                    }));   
                }  
            }
            else if(fbody.message.method === "notifyLiarAnswerTimeout") {
                setState((prevState)=>({ ...prevState, phase:7 }));
                console.log("liar timeout")
                if(connectionInfo.room.ownerId === connectionInfo.user.userId) {
                    stompClient.send(`/publish/private.${connectionInfo.room.roomId}`, {}, JSON.stringify({
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
                setState((prevState)=>({ ...prevState, phase:7 }));
                console.log("round end");
                if(fbody.message.body.state === "BEFORE_ROUND" && connectionInfo.room.ownerId === connectionInfo.user.userId) {
                    console.log("start round")
                    stompClient.send(`/publish/private.${connectionInfo.room.roomId}`, {}, JSON.stringify({
                        "senderId":connectionInfo.room.ownerId, 
                        "message":{"method":"startRound", "body":null},
                        "uuid":"a8f5bdc9-3cc7-4d9f-bde5-71ef471b9308"
                    }));  
                }
                else if(fbody.message.body.state === "PUBLISH_RANKINGS" && connectionInfo.room.ownerId === connectionInfo.user.userId) {
                    console.log("publish ranking")
                    stompClient.send(`/publish/private.${connectionInfo.room.roomId}`, {}, JSON.stringify({
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
                setState((prevState) => ({ ...prevState,
                    chatlog: [...prevState.chatlog, <p key={prevState.chatlog.length}> [시스템]: 게임이 종료되었습니다.</p>]
                }));
            }
        }, {"Authorization": `${connectionInfo.token.grantType} ${connectionInfo.token.accessToken}`});

        stompClient.subscribe(`/exchange/message.direct/room.${connectionInfo.room.roomId}.user.${connectionInfo.user.userId}`, function (frame) {
            console.log("subscribe each client", frame.body);
            fbody=JSON.parse(frame.body);
            if(fbody.message.method === "notifyLiarSelected")
            {
                if(fbody.message.body.liar) {
                    setState((prevState)=>({
                        ...prevState, liar: connectionInfo.user.userId,
                        chatlog: [...prevState.chatlog, <p key={prevState.chatlog.length}> [시스템]: 당신은 라이어입니다.</p>]
                    }));
                }
                else {
                    setState((prevState)=>({
                        ...prevState, chatlog: [...prevState.chatlog, <p key={prevState.chatlog.length}> [시스템]: 당신은 시민입니다.</p>]
                    }));
                }
                if(connectionInfo.room.ownerId === connectionInfo.user.userId) {
                    console.log("notifyLiarSelected - openKeyword")
                    stompClient.send(`/publish/private.${connectionInfo.room.roomId}`, {}, JSON.stringify({
                        "senderId":connectionInfo.room.ownerId, 
                        "message":{"method":"openKeyword", "body":null},
                        "uuid":"a8f5bdc9-3cc7-4d9f-bde5-71ef471b9308"
                    }));   
                }     
            }
            else if(fbody.message.method === "notifyLiarAnswerNeeded") { //라이어만 받는 메세지.
                console.log("라이어는 답을 말하라")
            }
            else if(fbody.message.method === "notifyKeywordOpened") {
                console.log("notifyGameState", fbody)
                setState((prevState)=>({ ...prevState, 
                    category: fbody.message.body.category, 
                    keyword: fbody.message.body.keyword.length > 0 ? fbody.message.body.keyword : "LIAR"
                }));
            }
            else if(fbody.message.method === "notifyGameState") {
                console.log("notifyGameState", fbody)
            }
        }, {"Authorization": `${connectionInfo.token.grantType} ${connectionInfo.token.accessToken}`});

        //에러 처리 위한 채널
        stompClient.subscribe(`/exchange/message.error/user.${connectionInfo.user.userId}`, function (frame) {
            console.log("subscribe errors",frame.body);
        }, {"Authorization": `${connectionInfo.token.grantType} ${connectionInfo.token.accessToken}`});
    }

    const startGame = () => {
        if(connectionInfo.room.roomId && connectionInfo.room.ownerId === connectionInfo.user.userId)
        {            
            stompClient.send(`/publish/private.${connectionInfo.room.roomId}`, {}, JSON.stringify({
                "senderId":connectionInfo.room.ownerId, 
                "message":{"method":"startGame", "body":{"round":1,"turn":1,"category":["food","sports"]}},
                "uuid":"a8f5bdc9-3cc7-4d9f-bde5-71ef471b9308"
            }));
            console.log("start game!");
        }
    }

    const sendMessage = () => {
        if(state.mustAnswer) {
            if(connectionInfo.room.roomId) {
                stompClient.send(`/publish/private.${connectionInfo.room.roomId}`, {}, JSON.stringify({
                    "senderId":connectionInfo.user.userId, 
                    "message":{"method":"checkKeywordCorrect", "body": {"keyword": state.message}},
                    "uuid":"a8f5bdc9-3cc7-4d9f-bde5-71ef471b9308"
                }));  
            }
            setState({ ...state, mustAnswer: false, message: '' });
        }
        else {
            let messageType = "MESSAGE";
            if(state.turn && state.turn.userId === connectionInfo.user.userId) {
                console.log("send hint")
                messageType = "DESCRIPTION";
            }
                
            const m = {"message": state.message,"senderId": connectionInfo.user.userId, "type": messageType};
            if(connectionInfo.room.roomId) {
                stompClient.send(`/publish/messages.${connectionInfo.room.roomId}`, {}, JSON.stringify(m));
            }
            setState({ ...state, message: '' });
        }
    }

    const sendVote = (index) => {
        if(connectionInfo.room.roomId && connectionInfo.userList) {
            stompClient.send(`/publish/private.${connectionInfo.room.roomId}`, {}, JSON.stringify({
                "senderId":connectionInfo.user.userId, 
                "message":{"method":"voteLiar", "body": {"liar": connectionInfo.userList[index].userId}},
                "uuid":"a8f5bdc9-3cc7-4d9f-bde5-71ef471b9308"
            }));  
        }
    }


    return (
    <Game
        isOwner={connectionInfo && connectionInfo.room.ownerId === connectionInfo.user.userId}
        startGame={startGame}
        leaveTheRoom={leaveTheRoom}
        toResult={toResult}
        members={connectionInfo ? connectionInfo.userList : []}
        category={state.category}
        keyword={state.keyword}
        sendVote={sendVote}
        sendMessage={sendMessage}
        state={state}
        setState={setState}
    />
    );
};

export default GameForm;