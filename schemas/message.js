const mongoose = require('mongoose');

const { Schema } = mongoose;
const { Types: { ObjectId }} = Schema;
const messageSchema = new Schema({
    //보낸 유저 id
    creator:{
        type: ObjectId,
        ref: 'User',
    },
    //소속된 room id
    room:{
        type:ObjectId,
        required: true,
        ref: 'Room'
    },
    //보내지는 데이터의 종류 text image emoji
    category:{
        type: String,
        required: true,
    },
    //보내지는 데이터
    messageData:{
        type: Object,
    },
    //생성 시간
    createAt:{
        type: Date,
        default: Date(),
    },
});

module.exports = mongoose.model('Message', messageSchema);