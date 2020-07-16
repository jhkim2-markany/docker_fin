//Routing 관련 일을 처리한다.

import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import LandingPage from './components/views/LandingPage/LandingPage'
import LoginPage from './components/views/LoginPage/LoginPage'
import RegisterPage from './components/views/RegisterPage/RegisterPage'
import Auth from './hoc/auth'

//한줄처리도 가능 
function App() {
  return (
    <Router>
    <div>
      <Switch> 
        <Route exact path="/" component={Auth(LandingPage, null)} />
                          {/*이런식으로 한줄 처리도 가능*/ }
       {/*component가 있어야지 컴포넌트 기능 ex)props를 받을 수 있다.*/}

        <Route exact path="/login" component={Auth(LoginPage, false)} />

        <Route exact path="/register" component={Auth(RegisterPage, false)}/>
      </Switch>
    </div>
  </Router>
  );
} 

/* 
exact 속성은 말 그대로 정확한 path 경로를 의미합니다.
exact 속성이 없다면, 라우트가 모두 '/' 를 포함하고 있기 때문에 
두 번째 라우트인 /login 경로에 접속했을 때  LandingPage도  보이게 된다. 
이를 방지하기 위해 exact 속성을 사용합니다.
*/

export default App;
