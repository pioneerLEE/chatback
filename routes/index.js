const express = require('express');
const User = require('../schemas/user');
const Room = require('../schemas/room');

const router = express.Router();

//로그인. 이메일 비밀번호 입력
router.post('/signin',async(req,res,next)=>{
    const { email, password } = req.body;
    try{
        console.log(email,password);
        const [exUser] = await User.find({email,password});
        console.log(exUser);
        if(exUser){
            return res.status(200).json({exUser});
        }else{
            return res.send(401);
        }
    }catch(error){
        next(error);
    }
});
//회원가입. 이메일 비밀번호 닉네임 입력. 이메일 중복확인
router.post('/signup',async(req,res,next)=>{
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
//방 만들기
router.post('/newroom',async(req,res,next)=>{
    const { userId } = req.body;
    try{
        const room = await new Room({
            participants:[
                userId
            ],
            creator:userId
        }).populate(['participants']);
        await room.save();
        return res.status(201).json({room});
    }catch(error){
        next(error);
    }
})
//방 리스트 보기 //이모티콘 레이트
router.get('/roomlist',async(req,res,next)=>{
    try{
        const rooms = await Room.find({});
        return res.json({rooms});
    }catch(error){
        next(error);
    }
});
//방 참가하기
/*
router.patch('/room/:id',(req,res,next)=>{
    const { userId } = req.body;
    const RoomId = req.params.id;
    try{
        await Room.update({_id:RoomId})
        
    }
})*/

module.exports = router;