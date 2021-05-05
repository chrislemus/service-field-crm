import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import userReducer from './userReducer';
import authUserReducer from './authUserReducer';
import alertModalReducer from './alertModalReducer';
import customerListReducer from './customerListReducer';
import customerReducer from './customerReducer';

const createRootReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    user: userReducer,
    authUser: authUserReducer,
    alertModal: alertModalReducer,
    customerList: customerListReducer,
    customer: customerReducer,
  });

export default createRootReducer;
