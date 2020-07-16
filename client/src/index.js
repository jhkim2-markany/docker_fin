import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
//리덕스를 연결시켜주기 위해서 Provider를 이용한다.
import { Provider } from 'react-redux'
import 'antd/dist/antd.css'

import { applyMiddleware, createStore } from 'redux';
//미들웨어 , 스토어생성

import promiseMiddleware from 'redux-promise';
import ReduxThunk from 'redux-thunk';

import Reducer from './_reducers/index.js'
//      /index.js가 없어도 알아서 찾아준다.

const createStoreWithMiddleware = applyMiddleware(promiseMiddleware, ReduxThunk)(createStore)
//리덕스 미들웨어를 이용해서 객체의 액션만 받는 리덕스 스토어에
//프로미스 형식과 함수도 받게 할 수 있다.

//Redux_devtools을 연결하기 위해서 사용함
ReactDOM.render(

  <Provider
    store={createStoreWithMiddleware(Reducer,
      window.__REDUX_DEVTOOLS_EXTENSION__ &&
      window.__REDUX_DEVTOOLS_EXTENSION__()
      )}
  >
    <App />,
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

