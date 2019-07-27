const express = require('express');
const User = require('../schemas/user');

const router = express.Router();

//로그인. 이메일 비밀번호 입력
router.post('/signin',async(req,res,next)=>{
    const { email, password } = req.body;
    try{
        console.log(email,password);
        const [exUser] = await User.find({email});
        console.log(exUser);
        if(exUser){
            return res.json(exUser);
        }else{
            return res.send(401);
        }
    }catch(error){
        next(error);
    }
});
//회원가입. 이메일 비밀번호 닉네임 입력. 이메일 중복확인
router.post('/signup',async(req,res)=>{
    const { email, password, nick } = req.body;
    try{
        const [exUser] = await User.find({email});
        console.log(email,password,nick,exUser);
        if(exUser){
            return res.send(406);
        }else{
            const user = await new User({
                nick,
                email,
                password,
            });
            await user.save();
            return res.send(201);
        }
    }catch(error){
        next(error);
    }
});

module.exports = router;