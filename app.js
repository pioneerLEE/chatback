const express = require('express');
const morgan = require('morgan'); 
//morgan 은 request 와 response 를 정말 깔끔하게 formatting 해주는 모듈입니다.
//formatting 된 log 를 json 형식으로 dump 로 파일에 기록해주는 모듈이 바로 winston 입니다.

require('dotenv').config();
const app = express();
const connect = require('./schemas');

connect();
app.set('port', process.env.PORT || 8001);

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


const signRouter = require('./routes/sign');


app.use('/',signRouter);

//404처리 미들웨어
app.use((req,res,next)=>{
    const err = new Error('NOT FOUND');
    err.status = 404;
    next(err);
});
//에러 핸들러
app.use((err,req,res)=>{
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development'?err:{};
    res.status(err.status || 500);
    res.render('error');
});
app.listen(app.get('port'),()=>{
    console.log(app.get('port'),'번 포트가 실행 중 입니다.');
})

