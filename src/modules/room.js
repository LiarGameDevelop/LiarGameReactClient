import { createAction, handleActions } from 'redux-actions';
import { takeLatest } from 'redux-saga/effects';
import createRequestSaga, {
  createRequestActionTypes
} from '../lib/CreateRequestSaga';
import * as roomAPI from '../lib/api/room';

const [POST_ROOM_MAKE, POST_ROOM_MAKE_SUCCESS, POST_ROOM_MAKE_FAILURE] = createRequestActionTypes(
    'room/MAKE'
);

const [DELETE_ROOM_DELETE, DELETE_ROOM_DELETE_SUCCESS, DELETE_ROOM_DELETE_FAILURE] = createRequestActionTypes(
    'room/DELETE'
);

const [POST_ROOM_ENTER, POST_ROOM_ENTER_SUCCESS, POST_ROOM_ENTER_FAILURE] = createRequestActionTypes(
    'room/ENTER'
);

const [POST_ROOM_LEAVE, POST_ROOM_LEAVE_SUCCESS, POST_ROOM_LEAVE_FAILURE] = createRequestActionTypes(
    'room/LEAVE'
);

export const makeRoom = createAction(POST_ROOM_MAKE, ({ maxPersonCount, roomName, ownerName }) => ({
    maxPersonCount,
    roomName,
    ownerName,
}));

export const deleteRoom = createAction(DELETE_ROOM_DELETE, ({ roomId, ownerId }) => ({
    roomId,
    ownerId,
}));

export const enterRoom = createAction(POST_ROOM_ENTER, ({ roomId, username }) => ({
    roomId,
    username,
}));

export const leaveRoom = createAction(POST_ROOM_LEAVE, ({ roomId, userId }) => ({
    roomId,
    userId,
}));

// saga
const makeRoomSaga = createRequestSaga(POST_ROOM_MAKE, roomAPI.makeRoom);
const deleteRoomSaga = createRequestSaga(DELETE_ROOM_DELETE, roomAPI.deleteRoom);
const enterRoomSaga = createRequestSaga(POST_ROOM_ENTER, roomAPI.enterRoom);
const leaveRoomSaga = createRequestSaga(POST_ROOM_LEAVE, roomAPI.leaveRoom);

export function* roomSaga() {
    yield takeLatest(POST_ROOM_MAKE, makeRoomSaga);
    yield takeLatest(DELETE_ROOM_DELETE, deleteRoomSaga);
    yield takeLatest(POST_ROOM_ENTER, enterRoomSaga);
    yield takeLatest(POST_ROOM_LEAVE, leaveRoomSaga);
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
        [DELETE_ROOM_DELETE_SUCCESS]: (state, _) => ({
            ...state,
            connectionInfo: null,
            error: null,
        }),
        [DELETE_ROOM_DELETE_FAILURE]: (state, { payload: error }) => ({
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
        [POST_ROOM_LEAVE_SUCCESS]: (state, { payload: connection_info }) => ({
            ...state,
            connectionInfo: connection_info,
            error: null,
        }),
        [POST_ROOM_LEAVE_FAILURE]: (state, { payload: error }) => ({
            ...state,
            error,
        }),
    },
    initialState,
);

export default room;