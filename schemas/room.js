const mongoose = require('mongoose');

const { Schema } = mongoose;
const { Types:{ ObjectId }} = Schema;
const roomSchema = new Schema({
    //소속된 user id 목록
    participants:[
        {
            type:ObjectId,
            ref:'User'
        }
    ],
    //생성된 user id
    creator:{
        type:ObjectId,
        required: true,
        ref: 'User'
    },
    //대화된 message id 목록
    messages:[
        {
            type:ObjectId,
            ref:'Message'
        }
    ],
    //생성된 시간
    createAt:{
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Room',roomSchema);