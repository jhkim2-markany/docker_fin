import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { auth } from "../_actions/user_action";


//adminRoute를 아무도 안쓰면 null이다
export default function (SpecificComponent, option, adminRoute = null) {
  function AuthenticationCheck(props) {
    //app.js에 export하게 된다.
    //두번째 인수 -> option의 뜻은
    //null => 아무나 출입이 가능한 페이지
    //ture => 로그인한 유저만 출입이 가능한 페이지
    //false => 로그인한 유저는 출입이 불가능한 유저
    //세번쨰 -> adminRoute는 true라고 하면 된다.
    const dispatch = useDispatch();

    useEffect(() => {
      dispatch(auth()).then((response) => {
        console.log(response);
        //로그인 하지 않은 상태
        if (!response.payload.isAuth) {
          if (option) {
            props.history.push("/login");
          }
        } else {
          //로그인 한 상태
          if (adminRoute && !response.payload.isAdmin) {
            props.history.push("/");
          } else {
            if (option === false) 
            props.history.push("/");
          }
        }
      });
    }, []);

    return <SpecificComponent
     />;
  }
  return AuthenticationCheck;
}
