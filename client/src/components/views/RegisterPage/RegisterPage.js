import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { registerUser } from "../../../_actions/user_action";
import { withRouter } from "react-router-dom"

function RegisterPage(props) {
  const dispatch = useDispatch();

  const [Email, setEmail] = useState("");
  const [Name, setName] = useState("")
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("")

  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value);
  };

  const onNameHandler = (event) => {
    setName(event.currentTarget.value);
  };

  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value);
  };

  const onConfirmPasswordHandler = (event) => {
    setConfirmPassword(event.currentTarget.value);
  };


  const onSubmitHandler = (event) => {
    event.preventDefault();

    //비밀번호와 비밀번호 확인이 같아야한다. 
    if(Password !== ConfirmPassword){
      return alert('비밀번호와 비밀번호 확인은 같아야합니다.')
    }

    //서버에 보내기
    let body = {
      email: Email,
      name: Name,
      password: Password  //비밀번호확인이 없는 이유는 위에서 같지 않으면 흐름이 내려가지 않기 떄문
    };
    // Axios.post('/api/user/register', body) 원래는 이런식으로 보내면
    // 더 간결해지지만, redux교육을 위해서 복잡하게 실행함

    dispatch(registerUser(body))
    .then(response => {
        if(response.payload.success){
          props.history.push('/login')
        } else {
          alert("회원가입 실패")
        }
    })
  };

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
      <form
        style={{ display: "flex", flexDirection: "column" }}
        onSubmit={onSubmitHandler}
      >
        <label>Email</label>
        <input type="email" value={Email} onChange={onEmailHandler} />

        <label>Name</label>
        <input type="text" value={Name} onChange={onNameHandler} />

        <label>Password</label>
        <input type="Password" value={Password} onChange={onPasswordHandler} />

        <label>ConfirmPassword</label>
        <input type="Password" value={ConfirmPassword} onChange={onConfirmPasswordHandler} />

        <br />
        <button type="submit">회원가입</button>
      </form>
    </div>
  );
}

export default withRouter(RegisterPage);
