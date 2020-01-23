var createError = require('http-errors');
var { Board, Comment } = require('../../../models');
const express = require('express');
const jwt = require('jsonwebtoken');
//const { isLoggedIn, isNotLoggedIn } = require('../../middlewares');
const router = express.Router();
const logger = require('../../../config/logger');

router.use('/comment', require('./comment'));
router.use(express.json())

router.get('/', async (req, res, next) => {
  try{
    logger.method('"/board"에 get실행')
    let result = await Board.findAll({
      logging: (str) => {
        str = str.substr(21);
        logger.query(str)
      }
    })
    logger.method('"/board"에 get실행완료')
    await res.send({ posts: result })
  }
  catch(e){
    log.error(`"/board"에 get에서 error : ${e}`);
    res.send({ success: false, msg: e.message })
  }
});

router.post('/', async (req, res, next) => {
  try {
    logger.method('"/board"에 post실행')
    await Board.create({
      catagory: req.body.catagory,
      title: req.body.title,
      writer: req.body.writer,
      content: req.body.content,
      views: 0
    }, {
      logging: (str) => {
        str = str.substr(21);
        logger.query(str)
      }
    });
    logger.method('"/board"에 post실행완료')
    await res.send({ page: true })
  }
  catch (e) {
    logger.error('"/board"에 post에서 ERROR' + ' : ' + e)
    res.send({ success: false, msg: e.message })
  }
});

router.put('/', async (req, res, next) => {
  try {
    logger.method('"/board"에 put실행')
    await Board.update(
      {
        title: req.body.title,
        content: req.body.content
      },
      {
        where: { id: req.body.id }, logging: (str) => {
          str = str.substr(21);
          logger.query(str)
        },
        returning: true
      },
    )
    logger.method('"/board"에 put실행완료')
    await res.send({ page: true })
  }
  catch (e) {
    logger.error('"/board"에 put에서 ERROR')
    res.send({ success: false, msg: e.message })
  }
});

router.delete('/', async (req, res, next) => {
  try {
    logger.method('"/board"에 delete실행')
    await Board.destroy(
      {
        where: { id: req.body.id },
        logging: (str) => { str = str.substr(21); logger.query(str) }
      }
    )
    logger.method('"/board"에 delete실행완료')
    await res.send({ page: true })
  }
  catch (e) {
    logger.error('"/board"에 delete에서 ERROR')
    res.send({ success: false, msg: e.message })
  }
});

router.all('*', function (req, res, next) {
  logger.error('"/board"에 없는 경로')
  next(createError(404, '그런 api 없어'));
});

module.exports = router;