//몽구스 모듈 호출
const mongoose = require('mongoose')

//bcrypt 암호화
const bcrypt = require('bcryptjs');
const saltRounds = 10; //salt의 만들떄 10자리인 salt를 만듬

//토큰 모듈 불러오기
const jwt = require('jsonwebtoken');
const { json } = require('body-parser');


//몽구스 스키마 작성
const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    //trim 공백제거 
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    //role을 주는 이유는 일반 유저와 관리자를 나누기 위홤
    role: {
        type: Number,
        default: 0
    },

    //object를 사용하지 않고 직접적으로 줄 수 잇다.
    image: String,

    //token을 이용해서 유효성을 관리할 수 있다.
    token: {
        type: String
    },

    //tokenExp를 이용하여 토큰 유효기간을 정한다.
    tokenExp: {
        type: Number
    }
})
//만들어진 스키마를 모델로 감싼다.


 //비밀번호를 암호화 시킨다 -> salt를 이용해서 비밀번호를 암호화 한다.
userSchema.pre('save', function( next ){
    var user = this;
    //this => userSchema

    if(user.isModified('password')){

    bcrypt.genSalt(saltRounds,function(err, salt){
        if(err) return next(err)

        bcrypt.hash(user.password, salt, function(err, hash){
            if(err) return next(err)
            user.password = hash
            next()
         })
     })
    } else {
        next()
    }
})
                    //만든 메소드
userSchema.methods.comparePassword = function(plainPassword, cb){

    //plainPassword와 암호화된 비밀번호가 같은지 체크해야한다. 
    //plainPassword를 암호화해서 db에 있는 비밀번호와 같은지 체크한다.
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return cb(err);
        cb(null, isMatch);
    });
};
                    //만든 메소드
userSchema.methods.generateToken = function(cb){
    var user = this;
    // console.log('user._id', user._id)

    //jsonwebtoken을 이용해서 토큰생성하기
    var token = jwt.sign(user._id.toHexString(), 'secretToken')
    user.token = token
    user.save(function(err, user){
        if(err) return cb(err)
        cb(null, user)
    })

}

userSchema.statics.findByToken = function(token, cb) {
    var user = this;

    //토큰을 decode한다.
    jwt.verify(token,'secretToken', function(err, decoded){
        //유저 아이디를 이용해서 유저를 찾은 다음에 
        //클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인

        user.findOne({ "_id" : decoded, "token": token}, function(err, user){
            //에러가 있으면은
            if(err) return cb(err);
            //만약 에러가 없다면은
            cb(null, user)
        })

    })
    
}


                     //이 User는 정하는거고, userSchema는 위에 만들어진 스키마 
const User = mongoose.model('User', userSchema) 

//다른곳에서 사용하기 위해서 모델 const User를 export함
module.exports = { User }