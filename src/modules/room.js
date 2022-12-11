import { createAction, handleActions } from 'redux-actions';
import { takeLatest } from 'redux-saga/effects';
import createRequestSaga, {
  createRequestActionTypes
} from '../lib/CreateRequestSaga';
import * as roomAPI from '../lib/api/room';

const [POST_MOVIE_MAKE, POST_MOVIE_MAKE_SUCCESS, POST_MOVIE_MAKE_FAILURE] = createRequestActionTypes(
    'room/MAKE'
);

const [DELETE_MOVIE_DELETE, DELETE_MOVIE_DELETE_SUCCESS, DELETE_MOVIE_DELETE_FAILURE] = createRequestActionTypes(
    'room/DELETE'
);

export const makeRoom = createAction(POST_MOVIE_MAKE, ({ maxPersonCount, roomName, ownerName }) => ({
    maxPersonCount,
    roomName,
    ownerName,
}));

export const deleteRoom = createAction(DELETE_MOVIE_DELETE, ({ roomId, ownerId }) => ({
    roomId,
    ownerId,
}));

// saga
const makeRoomSaga = createRequestSaga(POST_MOVIE_MAKE, roomAPI.makeRoom);
const deleteRoomSaga = createRequestSaga(DELETE_MOVIE_DELETE, roomAPI.deleteRoom);

export function* roomSaga() {
    yield takeLatest(POST_MOVIE_MAKE, makeRoomSaga);
    yield takeLatest(DELETE_MOVIE_DELETE, deleteRoomSaga);
}

const initialState = {
    connectionInfo: null,
};


const room = handleActions(
    {
        [POST_MOVIE_MAKE_SUCCESS]: (state, { payload: connection_info }) => ({
            ...state,
            connectionInfo: connection_info,
            error: null,
        }),
        [POST_MOVIE_MAKE_FAILURE]: (state, { payload: error }) => ({
            ...state,
            error,
        }),
        [DELETE_MOVIE_DELETE_SUCCESS]: (state, _) => ({
            ...state,
            connectionInfo: null,
            error: null,
        }),
        [DELETE_MOVIE_DELETE_FAILURE]: (state, { payload: error }) => ({
            ...state,
            error,
        }),
    },
    initialState,
);

export default room;