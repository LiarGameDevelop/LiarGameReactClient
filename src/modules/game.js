import { createAction, handleActions } from 'redux-actions';
import { takeLatest } from 'redux-saga/effects';
import createRequestSaga, {
  createRequestActionTypes
} from '../lib/CreateRequestSaga';

//module to store game info
const INITIALIZE_FORM = 'game/INITIALIZE_FORM';
const SET_GAME = 'game/SET_GAME';
const SET_RESULT = 'game/SET_RESULT';


export const initializeForm = createAction(INITIALIZE_FORM, form => form); // settings / results

export const setGame = createAction(SET_GAME, ({ maxPersonCount, maxRound, maxHint, category }) => ({
    maxPersonCount,
    maxRound,
    maxHint,
    category
}));

export const setScore = createAction(SET_RESULT, ({ scores }) => ({
  scores
}));

const initialState = {
    settings: {
        maxRound: 1,
        maxHint: 1,
        category: []
    },
    result: {
        scores: [],
    },
};

const game = handleActions(
    {
        [INITIALIZE_FORM]: (state, { payload: form }) => ({
            ...state,
            [form]: initialState[form],
        }),
        [SET_GAME]: (state, { payload: { maxRound, maxHint, category } }) => ({
            ...state,
            settings: {
                maxRound,
                maxHint,
                category
            }
        }),
    },
    initialState,
);

export default game;