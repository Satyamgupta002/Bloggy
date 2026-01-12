const express = require("express")
const path = require("path")
const userRouter = require("./routes/user.routes.js")

const { connectDB } = require("./db_connection.js")

const app = express();
const PORT = 8002;

connectDB(`mongodb+srv://SatyamGupta:satyam123@basicbackendproject.zebfuft.mongodb.net/blogify`)
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

app.get('/',(req,res) =>{
    return res.render("home")
})

app.use('/user', userRouter)

app.listen(PORT, () => console.log(`Server Started at PORT: ${PORT}`))