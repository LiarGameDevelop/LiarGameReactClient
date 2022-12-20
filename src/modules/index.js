import { combineReducers } from 'redux';
import { all } from 'redux-saga/effects'
import room,{roomSaga} from './room';
import stomp,{stompSaga} from './stomp';
import loading from './loading';



const appReducer = combineReducers({
  room,
  stomp,
  loading,
});

export function* rootSaga() {
  yield all(
    [ roomSaga(), stompSaga() ]
  )
}

const rootReducer = (state, action) => {
  return appReducer(state, action)
}

export default rootReducer;