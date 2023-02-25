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
  if (action.type === 'room/LEAVE') {
    state = undefined
    console.log("LEAVE")
    localStorage.removeItem('connectionInfo')
    localStorage.removeItem('stompClient')
  }
  return appReducer(state, action)
}

export default rootReducer;