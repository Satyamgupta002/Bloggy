const {Router} = require('express')
const Blog = require('../models/blog.models.js')
const mongoose = require('mongoose')

const router = Router()

//multer setup begin
const multer = require('multer')
const path = require('path')
 
const storage = multer.diskStorage({
    destination: function (req,file,cb){
        cb(null, path.resolve(`./public/Blog_Cover_images/`))
    },
    filename: function (req,file,cb){
        const fileName = `${Date.now()}-${file.originalname}`
        cb(null,fileName)
    }
})

const upload = multer({storage: storage})

router.get('/add-new',(req,res)=>{
    return res.render('addBlog',{
        user: req.user
    })
})

router.post('/', upload.single("coverImage"),async (req,res) => {  // /blog/
    const {title, body} = req.body
    
    const blog = await Blog.create({
        body,
        title,
        createdBy: req.user._id,
        coverImageURL: `/Blog_Cover_images/${req.file.filename}`
    })
    console.log(blog)
    return res.redirect(`/blog/${blog._id}`)
})

module.exports = router