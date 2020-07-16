//node.js = 자바스크립트를 웹브라우저가 아닌 서버사이드에서도 사용가능.
//express.js = node.js의 freamework 예시) node.js가 자동차의 엔진이면, 그 엔진을 이용해서 자동차를 만드는 프레임워크
//=> node.js를 쉽게 이용하기 위한 freamework
//npm init으로 package.json을 생성
//npm install express --save 실행 => node_modules 폴더 생성
//package.json에 dependencies에 express 추가됨
//install한 dependencies들을 이 폴더에서 관리됨.
//https://www.zerocho.com/category/NodeJS/post/58285e4840a6d700184ebd87
//npm run start
//Model은 Schema를 감싸주는 역할
//Schema는 하나하나의 정보를 지정한다.

const express = require("express");
const app = express();
const port = 5000;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const config = require("./config/key");

const { auth } = require("./middleware/auth");
const { User } = require("./models/User");

//가져오는 정보를 분석해서 가져올수 있게 한다.
app.use(bodyParser.urlencoded({ extended: true }));

//json 타입으로 된것을 분석해서 가져온다.
app.use(bodyParser.json());

//express에서 제공되는 모듈 -> app.
app.use(cookieParser());

const mongoose = require("mongoose");
mongoose //config는 mongoURI가 들어있음 Import 함
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("DB Connected..."))
  .catch((err) => console.log(err));

app.get("/", (req, res) => res.send("Hi"));

//여기서 요청을 받은다음에 다시 보내준다.
app.get("/api/hello", (req, res) => {
  res.send("안녕하세요~"); //res 다시 프론트로 보냄
});

app.post("/api/users/register", (req, res) => {
  //회원가입할떄 필요한 정보들을 client에서 가져오면
  //그것을들 데이터 베이스에 넣어준다.

  //req.body 안에는 json 형식으로 들어있다.
  const user = new User(req.body);

  //save는 몽고db에서 오는 메소드
  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

app.post("/api/users/login", (req, res) => {
  //요청된 이메일을 데이터베이스에 있는지 찾는다. //findeOne => 몽고디비에서 지원하는 메소드
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다.",
      });
    }
    //요청된 이메일이 데이터 베이스에 있다면 비밀번호가 맞는 비밀번호인지 확인.
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({
          loginSuccess: false,
          message: "비밀번호가 틀렷습니다.",
        });
      //비밀 번호까지 같다면 Token 생성
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err); //status 400 => 실패했다는 뜻 -> send(err)

        // 토큰을 저장한다. 어디에?  쿠키, 로컬스토리지... 저장하는 방법은 여러가지가 있다.
        // 쿠키에 저장하기 위해서는 모듈을 설치해야한다.
        res
          .cookie("x_auth", user.token)
          .status(200) //성공했다는 표시
          .json({ loginSuccess: true, userId: user._id });
      }); //userId가 리덕스 스토어에 들어왔음
    }); //payload를 통해서 payload에는 request가 들어가 있음
  }); //requset는 백엔드에서 가져온 모든 data를 가지고 있다.
});

// role 0 -> 일반유저 role이 0이 아니면 관리자
//ex) role 1 -> 어드민 , role 2 => 특정 부서 어드민

//auth는 미드웨어 콜백함수를 하기전에 실행된다.
app.get("/api/users/auth", auth, (req, res) => {
  //여기 까지 미들웨어를 통과해 왔다는 이야기는 Auth가 ture라는 말.
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

//로그아웃은 로그인된 상태이기 떄문에 auth 미들웨어를 사용해야한다.
app.get("/api/users/logout", auth, (req, res) => {
  console.log("req.user", req.user);
  User.findByIdAndUpdate(
    { _id: req.user._id },
    { token: "" }, //토큰을 지워줌
    (err, user) => {
      //에러가 생겼을떄
      if (err) return res.json({ success: false, err });
      //성공
      return res.status(200).send({
        success: true,
      });
    }
  );
});

const ip = require("ip");
app.listen(port, () => console.log(`on port http://${ip.address()}:${port}/`));
