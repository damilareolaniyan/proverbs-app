const mongoose = require('mongoose')
const Comment = require('./comment')
const Schema = mongoose.Schema

const ProverbSchema = new Schema({
    title: String,
    author: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    comments:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
});

ProverbSchema.post('findOneAndDelete', async function(doc){
    if(doc){
        await Comment.deleteMany({
            _id: {
                $in: doc.comments
            }
        })
    }
})

module.exports = mongoose.model('Proverb', ProverbSchema)