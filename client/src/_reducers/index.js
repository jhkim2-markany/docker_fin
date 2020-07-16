import { combineReducers } from 'redux';  //combineReducers를 통해서 리덕스를 합쳐준다.
import user from './user_reducer';

const rootReducer = combineReducers({
    user,
})

export default rootReducer;