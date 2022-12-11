import { combineReducers } from 'redux';
import { all } from 'redux-saga/effects'
import room,{roomSaga} from './room';
import loading from './loading';



const appReducer = combineReducers({
  room,
  loading,
});

export function* rootSaga() {
  yield all(
    [ roomSaga() ]
  )
}

const rootReducer = (state, action) => {
  return appReducer(state, action)
}

export default rootReducer;