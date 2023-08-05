const express = require('express')

const router = express.Router()

const {proverbSchema} = require('../schemas.js')
const ProverbModel = require('../models/proverbs')
//const CommentModel = require('../models/comment.js')
const catchAsync = require('../utils/cathAsync')
const ExpressError = require('../utils/ExpressError')
const {isLoggedIn} = require('../middleware.js')

//Joi Validate
const validateProverb =  (req, res, next)=>{
    
    const {error} = proverbSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg, 400)
    }else{
        next()
    }
    }

//const isAuthor = async (req, res, next) =>{
    //const {id} = req.params;
    
   // }
   // next()
//}

//Displaying All Proverbs
router.get('/', async(req, res)=>{
    const pro = await ProverbModel.find({})
    res.render('proverbs/index', {pro})
})

//Add New Proverb
router.get('/new', isLoggedIn,(req, res)=>{
    res.render('proverbs/newProverb')
})

//Submitting Our Proverb 
router.post('/',isLoggedIn,validateProverb, catchAsync(async(req, res) =>{
    const proverb = new ProverbModel(req.body.proverb)
    proverb.user = req.user._id
    await proverb.save()
    req.flash('success', 'New Proverb Added')
    res.redirect(`/proverbs/${proverb._id}`)
    
}))

//Showing Individual Proverbs
router.get('/:id', async(req, res)=>{
    const proverb = await ProverbModel.findById(req.params.id).populate('comments').populate('user');
    //console.log(proverb)
    if(!proverb){
        req.flash('error', 'Cannot find that proverb')
        return res.redirect('/proverb')
    }
    res.render('proverbs/show', {proverb})
})

//Editing Proverb
router.get('/:id/edit', catchAsync(async(req, res)=>{
    const proverb = await ProverbModel.findById(req.params.id)
    res.render('proverbs/edit', {proverb})
}))

//Updating Our Proverb
router.put('/:id', isLoggedIn, async(req, res) =>{
    const {id} = req.params
    const proverb = await ProverbModel.findByIdAndUpdate(id, {...req.body.proverb});
    req.flash('success', 'Proverb Updated')
    res.redirect(`/proverbs/${proverb._id}`)
})


//Deleting a Proverb
router.delete('/:id', async(req, res) =>{
    const {id} = req.params
    await ProverbModel.findByIdAndDelete(id)
    res.redirect('/proverbs')
})

module.exports = router;