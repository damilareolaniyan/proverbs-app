const express = require('express')
const router = express.Router({mergeParams: true})
//const {proverbSchema} = require('../schemas.js')
const ProverbModel = require('../models/proverbs')
const CommentModel = require('../models/comment')
const catchAsync = require('../utils/cathAsync')
//const ExpressError = require('../utils/ExpressError')


    
//Adding Comment
router.post('/', catchAsync(async(req, res) =>{
    const proverb = await ProverbModel.findById(req.params.id)
    const {text} = req.body
    const comment = new CommentModel({text})
    proverb.comments.push(comment)
    
    await comment.save()
    await proverb.save()
    
    res.redirect(`/proverbs/${proverb._id}`)
}))
//Deleting Our Comment
router.delete('/:commentid', async(req, res) =>{
    const {id, commentId} = req.params
    await ProverbModel.findByIdAndUpdate(id, {$pull: {comments: commentId}})
    await CommentModel.findByIdAndDelete(commentId)
    //console.log(ti)
    res.redirect(`/proverbs/${id}`)
})


module.exports = router;