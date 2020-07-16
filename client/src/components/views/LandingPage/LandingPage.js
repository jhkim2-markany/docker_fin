import React, { useEffect } from "react";
import axios from "axios";
// import { response } from 'express'; 쓰면 안됨
// 서버에서 넘어오는게 아님
import {withRouter} from "react-router-dom"
// withRouter가 있어야지 props.history.push를 사용해서 라우팅을 할 수 있다.

function LandingPage(props) {
  //랜딩페이지에 들어 오자마자 실행하고
  useEffect(() => {
    //get req를 서버에 보냄 서버 주소는 /api/hello
    axios
      .get("/api/hello") //server로 보냄 -> index.js
      .then((response) => console.log(response));
  }, []);

  const onClickHandler = () => {
    axios.get('/api/users/logout')
    .then(response => {
      console.log(response.data)
      if(response.data.success){
        alert("로그아웃에 성공했습니다.")
        props.history.push("/")   
      } else {
        alert("로그아웃 하는데 실패 했습니다.")
      }
    })
  }
  const onLogin = () => {
        props.history.push("/login")
    }
  
    const onRegister = () => {
      props.history.push("/register")
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh",
      }}
    >
     <span>
     <h2>시작 페이지</h2>
      <button onClick={onRegister}>회원가입</button> <br/>
      <button onClick={onLogin}>로그인</button>   <br/>
      <button onClick={onClickHandler}> 로그아웃 </button>
    </span>
    </div>
  );
}

export default withRouter(LandingPage);
