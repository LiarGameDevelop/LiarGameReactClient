import { createAction, handleActions } from 'redux-actions';
import { takeLatest } from 'redux-saga/effects';
import createRequestSaga, {
  createRequestActionTypes
} from '../lib/CreateRequestSaga';
import * as roomAPI from '../lib/api/room';

const [POST_ROOM_MAKE, POST_ROOM_MAKE_SUCCESS, POST_ROOM_MAKE_FAILURE] = createRequestActionTypes(
    'room/MAKE'
);

const [POST_ROOM_ENTER, POST_ROOM_ENTER_SUCCESS, POST_ROOM_ENTER_FAILURE] = createRequestActionTypes(
    'room/ENTER'
);

const [GET_ROOM, GET_ROOM_SUCCESS, GET_ROOM_FAILURE] = createRequestActionTypes(
    'room/GET'
);

const ROOM_LEAVE = 'room/LEAVE';


export const makeRoom = createAction(POST_ROOM_MAKE, ({ maxPersonCount, ownerName, password }) => ({
    maxPersonCount,
    ownerName,
    password,
}));

export const enterRoom = createAction(POST_ROOM_ENTER, ({ roomId, username, password }) => ({
    roomId,
    username,
    password,
}));

export const getRoom = createAction(GET_ROOM, ({ roomId, token }) => ({
    roomId,
    token,
}));

export const leaveRoom = createAction(ROOM_LEAVE);

// saga
const makeRoomSaga = createRequestSaga(POST_ROOM_MAKE, roomAPI.makeRoom);
const enterRoomSaga = createRequestSaga(POST_ROOM_ENTER, roomAPI.enterRoom);
const getRoomSaga = createRequestSaga(GET_ROOM, roomAPI.getRoom);

export function* roomSaga() {
    yield takeLatest(POST_ROOM_MAKE, makeRoomSaga);
    yield takeLatest(POST_ROOM_ENTER, enterRoomSaga);
    yield takeLatest(GET_ROOM, getRoomSaga);
}

const initialState = {
    connectionInfo: null,
};


const room = handleActions(
    {
        [POST_ROOM_MAKE_SUCCESS]: (state, { payload: connection_info }) => ({
            ...state,
            connectionInfo: connection_info,
            error: null,
        }),
        [POST_ROOM_MAKE_FAILURE]: (state, { payload: error }) => ({
            ...state,
            error,
        }),
        [POST_ROOM_ENTER_SUCCESS]: (state, { payload: connection_info }) => ({
            ...state,
            connectionInfo: connection_info,
            error: null,
        }),
        [POST_ROOM_ENTER_FAILURE]: (state, { payload: error }) => ({
            ...state,
            error,
        }),
        [GET_ROOM_SUCCESS]: (state, { payload: connection_info }) => {
            state.connectionInfo.userList = connection_info.userList
            return {
                ...state,
                connectionInfo: state.connectionInfo,
                error: null,
            }
        },
        [GET_ROOM_FAILURE]: (state, { payload: error }) => ({
            ...state,
            error,
        }),
        [ROOM_LEAVE]: (state) => ({
            ...state,
            connectionInfo: null,
        }),
    },
    initialState,
);

export default room;