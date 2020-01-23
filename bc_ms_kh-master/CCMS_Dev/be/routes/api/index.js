const jwt = require('jsonwebtoken')
const { User } = require('../../models');
var express = require('express');
var router = express.Router();
var createError = require('http-errors');
const logger = require('../../config/logger'); 

router.use('/board', require('./board'));

router.use(express.json())

const signToken = (org_id, user_pw) => {
  //logger.method('"/"에 signToken메소드 실행')
  return new Promise((resolve, reject) => {
    jwt.sign({ org_id, user_pw }, '시크릿키', (err, token) => {
      if (err){ 
        //logger.error('"/"에 signToken메소드 에러')
        reject(err)
      }
      resolve(token)
    })
    //logger.method('"/"에 signToken메소드 실행완료')
  })
}

router.post('/', (req, res) => {
  //logger.method('"/"에 post실행')
  const { org_id, user_pw } = req.body
  
  let user={};
  console.log(org_id)
  User.findOne({where:{org_id:org_id}})
    .then((r) => {
      console.log('db연결확인')
      user = r
      if (!r){ 
        //logger.warn('"/"에 post에서 없는 아이디 일때')
        return res.send({ success: false, msg: '존재하지 않는 아이디입니다'})}
      if (r.user_pw !== user_pw){ 
        //logger.warn('"/"에 post에서 비밀번호가 틀렸을 때')
        return res.send({ success: false, msg: '비밀번호가 틀렸습니다'})
      }
      return signToken(r.org_id, r.user_pw)
    })
    .then((r) => {
      //logger.notice('ORG_ID : '+user.org_id+' 로그인')
      //logger.method('"/"에 post실행 완료')
      res.send({ success: true, token: r , user: user})
    })
    .catch((e) => {
      //logger.error('"/"에 post에서 ERROR'+' : '+e)
      res.send({ success: false, msg: e.message })
    })
})

router.all('*', function(req, res, next) {
  //logger.error('"/"에 없는 경로')
  next(createError(404, '낫파운드'));
});

module.exports = router;