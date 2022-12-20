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

export const makeRoom = createAction(POST_ROOM_MAKE, ({ maxPersonCount, roomName, ownerName }) => ({
    maxPersonCount,
    roomName,
    ownerName,
}));

export const deleteRoom = createAction(DELETE_ROOM_DELETE, ({ roomId, ownerId }) => ({
    roomId,
    ownerId,
}));

// saga
const makeRoomSaga = createRequestSaga(POST_ROOM_MAKE, roomAPI.makeRoom);
const deleteRoomSaga = createRequestSaga(DELETE_ROOM_DELETE, roomAPI.deleteRoom);

export function* roomSaga() {
    yield takeLatest(POST_ROOM_MAKE, makeRoomSaga);
    yield takeLatest(DELETE_ROOM_DELETE, deleteRoomSaga);
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
    },
    initialState,
);

export default room;