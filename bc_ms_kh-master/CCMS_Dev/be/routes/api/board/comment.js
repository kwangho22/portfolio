var createError = require('http-errors');
var { Comment,Board } = require('../../../models');
const express = require('express');
const jwt = require('jsonwebtoken');
//const { isLoggedIn, isNotLoggedIn } = require('../../middlewares');
const router = express.Router();
const logger = require('../../../config/logger'); 

router.use(express.json())

router.post('/', async (req, res, next)=> {
  //logger.method('"/board/comment"에 post실행')
  const { boardId,views} = req.body
  try{
    await Board.update(
      {
        views: views
      },
      { where: { id: boardId }, returning: true })

    const result = await Comment.findAll({
      where:{
        boardId: boardId
      }
    })
    //logger.method('"/board/comment"에 post실행종료')
    await res.send({ comments: result})
  }
  catch(e){
    //logger.error('"/board/comment"에 post에서 ERROR')
    res.send({ success: false, msg: e.message })//
  }
});

router.post('/add', async (req, res, next)=> {
  //logger.method('"/board/comment/add"에 post실행')
  const { boardId, writer, content } = req.body
  try{
    const result = await Comment.create({
      boardId,
      writer,
      content
    })
    //logger.method('"/board/comment/add"에 post실행완료')
    await res.send({ comment: result})
  }
  catch(e){
    //logger.error('"/board/comment/add"에 post에서 ERROR')
    res.send({ success: false, msg: e.message })
  }
});

router.put('/', async (req, res, next) => {
  //logger.method('"/board/comment"에 put실행')
  try{
    await Comment.update(
      {
        content: req.body.content
      },
      { where: { id: req.body.id }, returning: true })
    //logger.method('"/board/comment"에 put실행완료')
    await res.send({ page: true })
  }
  catch(e){
    //logger.error('"/board/comment"에 put에서 ERROR')
    res.send({ success: false, msg: e.message })
  }
});

router.delete('/', async (req, res, next) => {
  //logger.method('"/board/comment"에 delete실행')
  try{
    await Comment.destroy({ where: { id: req.body.id } })
    //logger.method('"/board/comment"에 delete실행완료')
    await res.send({ bard: true })
  }
  catch(e){
    //logger.error('"/board/comment"에 delete에서 ERROR')
    res.send({ success: false, msg: e.message })
  }
});

router.all('*', function (req, res, next) {
  //logger.error('"/board/comment"에 없는 경로')
  next(createError(404, '그런 api 없어'));
});

module.exports = router;