import { createAction, handleActions } from 'redux-actions';
import { takeLatest } from 'redux-saga/effects';
import createRequestSaga, {
  createRequestActionTypes
} from '../lib/CreateRequestSaga';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const socketEndPoint = `${process.env.REACT_APP_HOST}/ws-connection`

const [STOMP_CONNECT, STOMP_CONNECT_SUCCESS, STOMP_CONNECT_FAILURE] = createRequestActionTypes(
    'stomp/CONNECT'
);

const [STOMP_DISCONNECT, STOMP_DISCONNECT_SUCCESS, STOMP_DISCONNECT_FAILURE] = createRequestActionTypes(
    'stomp/DISCONNECT'
);

export const connectStomp = createAction(STOMP_CONNECT, ({ connectionInfo }) => ({
    connectionInfo
}));

export const disconnectStomp = createAction(STOMP_DISCONNECT, ({stompClient}) => ({
    stompClient
}));

const connect = (connectionInfo) => {
    console.log("socketEndPoint is ",socketEndPoint);
    if(!connectionInfo) {
        console.log("no connection info");
        return;
    }
    console.log("try connect",connectionInfo);

    const socket = new SockJS(socketEndPoint);
    console.log("new socket made", JSON.stringify(socket));
    const stompClient = Stomp.over(socket);
    // console.log("stompClient :", JSON.stringify(stompClient));

    return stompClient.connect({"username":"chulsoo","roomId":connectionInfo.roomId}, function (frame) {
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
        // return stompClient;
    })
    
}

const disconnect = (stompClient) => {
    if(stompClient) {
        stompClient.disconnect();
    }
}

const addChat = (message) => {
    console.log('implement addChat', message);
}

// saga
const connectStompSaga = createRequestSaga(STOMP_CONNECT, connect);
const disconnectStompSaga = createRequestSaga(STOMP_DISCONNECT, disconnect);

export function* stompSaga() {
    yield takeLatest(STOMP_CONNECT, connectStompSaga);
    yield takeLatest(STOMP_DISCONNECT, disconnectStompSaga);
}

const initialState = {
    stompClient: null,
};


const stomp = handleActions(
    {
        [STOMP_CONNECT_SUCCESS]: (state, { payload: stompClient }) => ({
            ...state,
            stompClient: stompClient,
            error: null,
        }),
        [STOMP_CONNECT_FAILURE]: (state, { payload: error }) => ({
            ...state,
            error,
        }),
        [STOMP_DISCONNECT_SUCCESS]: (state, { }) => ({
            ...state,
            stompClient: null,
            error: null,
        }),
        [STOMP_DISCONNECT_FAILURE]: (state, { payload: error }) => ({
            ...state,
            error,
        }),
    },
    initialState,
);

export default stomp;