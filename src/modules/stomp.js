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

const [STOMP_SUBSCRIBE, STOMP_SUBSCRIBE_SUCCESS, STOMP_SUBSCRIBE_FAILURE] = createRequestActionTypes(
    'stomp/SUBSCRIBE'
);

export const connectStomp = createAction(STOMP_CONNECT, ({ connectionInfo }) => (
    connectionInfo
));

export const disconnectStomp = createAction(STOMP_DISCONNECT, ({ stompClient }) => (
    stompClient
));

export const subscribeStomp = createAction(STOMP_SUBSCRIBE, ({ stompClient, destination, callback, header }) => (
    stompClient,
    destination,
    callback,
    header
));

const connect = (connectionInfo) => {
    if(!connectionInfo) {
        console.log("no connection info");
        return;
    }
    
    return new Promise((resolve) => {
        // const stompClient = Stomp.client("ws://43.200.32.236:8080/ws-connection");
        const socket = new SockJS(socketEndPoint);
        const stompClient = Stomp.over(socket);
        stompClient.connect({"Authorization": `${connectionInfo.token.grantType} ${connectionInfo.token.accessToken}`},
                            function (_) {
            resolve({ data: stompClient });
        });
    });    
}

const disconnect = (stompClient) => {
    console.log("disconnect stompClient", stompClient)
    if(stompClient) {
        return new Promise((resolve) => {
            stompClient.disconnect();
            resolve({ data: null });
        });
    }
}

const subscribe = (stompClient, destination, callback, header) => {
    console.log("subscribe",destination, callback, header)
    return new Promise((resolve) => {
        stompClient.subscribe(destination, callback, header);
        resolve({ data: destination });
    });
}

// saga
const connectStompSaga = createRequestSaga(STOMP_CONNECT, connect);
const disconnectStompSaga = createRequestSaga(STOMP_DISCONNECT, disconnect);
const subscribeStompSaga = createRequestSaga(STOMP_SUBSCRIBE, subscribe);

export function* stompSaga() {
    yield takeLatest(STOMP_CONNECT, connectStompSaga);
    yield takeLatest(STOMP_DISCONNECT, disconnectStompSaga);
    yield takeLatest(STOMP_SUBSCRIBE, subscribeStompSaga);
}

const initialState = {
    stompClient: null,
    subscribe: [],
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
        [STOMP_SUBSCRIBE_SUCCESS]: (state, { payload: subscribe }) => ({
            ...state,
            subscribe: [...state.subscribe, subscribe],
            error: null,
        }),
        [STOMP_SUBSCRIBE_FAILURE]: (state, { payload: error }) => ({
            ...state,
            error,
        }),
    },
    initialState,
);

export default stomp;