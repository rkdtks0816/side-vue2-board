var express = require('express');
var router = express.Router();
const db = require('../db')
const Queries = require('./queries/comments')
const jwtModules = require('../modules/jwt-modules')

router.post('/', jwtModules.userAuthenticate, (req, res, next)=>{
    const params = req.body
    let sql
    
    const addCommentWork = async()=>{
        const con = await db.getConnection()
        await db.beginTransaction(con)
        sql = Queries.insertComment(params)
        try{
            const inserted = await db.query(con, sql)
            await db.commit(con)
            con.release()
            return {comment_id: inserted.insertId}
        }catch(err) {
            await con.rollback()
            con.release()
            throw err
        }
    }

    addCommentWork()
    .then(result=>{
        res.status(200).send(result)
    })
    .catch(err=> next(err))
        
})

router.get('/', (req, res, next)=>{
    const params = req.query
    const sql = Queries.selectComments(params)
    
    const getCommentsWork = async() =>{
         const con = await db.getConnection()
         const result = await db.query(con, sql)
         con.release()
         return {comments: result}
    }

    getCommentsWork()
    .then(result=>{
        res.status(200).send(result)
    })
    .catch(err=> next(err))
})

router.delete('/', jwtModules.userAuthenticate, (req, res, next)=>{
    const user = req.user
    const params = req.query
    const loginUserId = user.user_id
    const deleteUserId = Number(params.user_id)
    let sql

    const deleteCommentWork = async()=>{
        if (loginUserId !== deleteUserId) {
            return {success: false, message: '삭제할 권한이 없습니다.'}
        }
        const con = await db.getConnection()
        sql = Queries.deleteComment(params)
        try{
            const deleted = await db.query(con, sql)
            await db.commit(con)
            con.release()

            if (deleted.affectedRows === 0) {
                return {success: false, message: '없는 댓글 이거나 이미 삭제된 댓글 입니다.'}
            } else {
                return {success: true, message: '삭제 되었습니다.'}
            }
        }catch(err){
            con.release()
            throw err
        }
    }

    deleteCommentWork()
    .then(result=>{
        res.status(200).send(result)
    })
    .catch(err=> next(err))
})

module.exports = router;