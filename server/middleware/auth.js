//User 모델 import
const { User } = require('../models/User');

let auth = (req, res, next) => {

    //인증처리가 이루어지는 곳


    //1) 클라이언트 쿠키에서 토큰을 가져온다.
    let token = req.cookies.x_auth;

    //2) 토큰을 복호화(디코드) 한후 유저를 찾는다.
    //만든 메소드
    User.findByToken(token, (err, user)=> {
        //유저가 없으면 에러
        if(err) throw err;
        if(!user) return res.json({ isAuth: false, error: true })

        //유저가 있으면 토큰정보를 넣어준다.
        req.token = token;
        req.user = user;
 
        next(); //next는 하는 이유는 미드웨어에서 다음 단계로 가도록한다.

    })

    //3) 유저가 있응면 인증 성공


    //4) 유저가 없으면 인증 실패

}


module.exports = { auth };