require("dotenv").config()

const express = require("express")
const path = require("path")
const userRouter = require("./routes/user.routes.js")
const blogRouter = require("./routes/blog.routes.js")
const cookieParser = require('cookie-parser')
const { connectDB } = require("./db_connection.js")
const { checkForAuthenticationCookie } = require("./middlewares/authentication.js")
const Blog = require('./models/blog.models.js')

const app = express();
const PORT = process.env.PORT || 8002;

connectDB(`${process.env.MONGO_URL}`)
.then(() =>{
    let port = PORT
    app.listen(port, () => {
        console.log(`Server is running at port: ${port}`)
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!!",err);
    
})

app.set("view engine","ejs")
app.set("views",path.resolve("./views"))

app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
app.use(checkForAuthenticationCookie("token"))
app.use(express.static(path.resolve('./public')))

app.get('/',async(req,res) =>{
    if(!req.user) return res.render("home")
    const allBlogs = await Blog.find({}).sort({"createdAt": -1})
    res.render("home",{
        user: req.user,
        blogs: allBlogs
    })
})

app.use('/user', userRouter)
app.use('/blog', blogRouter)

