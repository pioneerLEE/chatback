const express = require('express');
const User = require('../schemas/user');
const Room = require('../schemas/room');
const Message = require('../schemas/message');
const router = express.Router();

//로그인. 이메일 비밀번호 입력
router.post('/signin',async(req,res,next)=>{
    const { email, password } = req.body;
    try{
        const [exUser] = await User.find({email,password});
        if(exUser){
            return res.status(200).json(exUser);
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
        const [exUser] = await User.find({email}); //배열 형태로 가져오기 때문에 [변수]안에 담는다
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
//채팅방 만들기
router.post('/newroom',async(req,res,next)=>{
    const { userId } = req.body;
    const io = req.app.get('io');
    try{
        const room = await new Room({
            participants:[
                userId
            ],
            creator:userId
        }).populate('participants');
        await room.save();
        io.of('/chat').join(room._id);
        //유저 db에 유저가 속한 채팅 목록에 추가
        [exUser] = await User.find({_id:userId});
        await exUser.belongedRooms.push(room._id);
        await User.updateOne({_id:userId},{belongedRooms:exUser.belongedRooms});
        //다른 사람들의 리스트에 socket으로 새로 추가된 방 데이터 보내주기
        io.of('/room').emit('newRoom',room);
        return res.status(201).json(room);
    }catch(error){
        next(error);
    }
});
//채팅 참가하기 https://github.com/typicode/json-server/issues/258 참고해보기
router.patch('/room/:id',async(req,res,next)=>{
    const { userId } = req.body;
    const roomId = req.params.id;
    const io = req.app.get('io');
    try{
        const exRoom = await Room.findOne({_id:roomId});
        const exUser = await User.findOne({_id:userId});
        await exRoom.participants.push(userId);
        await Room.update({_id:roomId},{participants:exRoom.participants});
        io.of('/chat').join(roomId);
        io.of('/chat').to(roomId).emit('join',exUser);
        return res.send(202);
    }catch(error){
        next(error);
    }
});
//채팅 나가기
router.post('/room/:id',async(req,res,next)=>{
    const { userId } = req.body;
    const roomId = req.params.id;
    const io = req.app.get('io');
    try{
        //방 불러오기
        const exRoom = await Room.findOne({_id:roomId});
        const exUser = await User.findOne({_id:userId});
        //방 participants에서 userId 삭제
        const deletUserIndex = await exRoom.participants.findIndex((k)=>{
            return k == userId;
        });
        await exRoom.participants.splice(deletUserIndex,1);
        if(exRoom.participants,length===0){
            Room.remove({_id:roomId});
        }else{
            await Room.update({_id:roomId},{participants:exRoom.participants});
        }
        //유저 belongedRooms에서 roomId 삭제
        const deletRoomIndex = await exUser.belongedRooms.findIndex((k)=>{
            return k == roomId;
        });
        await exUser.belongedRooms.splice(deletRoomIndex,1);
        await User.update({_id:userId},{belongedRooms:exUser.belongedRooms});


        //삭제 후 chat namespace에 'user님이 방을 나갔습니다. 라고 socket 보내기
        io.of('/room').leave(roomId);
        io.of('/room').to(roomId).emit('exit',exUser);    
        return res.send(202);
    }catch(error){
        next(error);
    }
})
//방 리스트 보기 //이모티콘 레이트
router.get('/roomlist',async(req,res,next)=>{
    try{ 
        const rooms = await Room.find().populate(['creator']);
        return res.status(200).json(rooms);

    }catch(error){
        next(error);
    }
});
//채팅 보내기
router.post('/room/:id/message',async(req,res,next)=>{
    const {userId, category, messageData } = req.body;
    const roomId = req.params.id
    const io = req.app.get('io');
    //보내는 유저 id, 메시지가 보내지는 방 id, category, messageDate
    try{
        //message 생성
        const message = await new Message({
            creator:userId,
            room:roomId,
            category,
            messageData
        }); 
        //해당 메시지 같은 채팅 유저들에게 전송
        io.of('/chat').to(roomId).emit('chat',message);
        res.send('200');
    }catch(error){

    }
})


module.exports = router;