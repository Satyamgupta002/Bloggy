const {Schema} = require('mongoose')
const {createHmac, randomBytes} = require("crypto")
const mongoose = require('mongoose')

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    salt:{
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    profileImageURL: {
        type: String,
        default: '../public/images/default_profile.avif'
    },
    role:{
        type: String,
        enum: ["USER","ADMIN"],
        default: "USER"
    }
},{timestamps:true})

userSchema.pre("save",async function (){ //it runs before saving or updating any entry
    const user = this

    if(!user.isModified("password")) return;

    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac('sha256',salt).update(user.password).digest("hex")

    this.salt = salt
    this.password = hashedPassword

})

userSchema.static("matchPassword",async function (email,password){  // to match the password
    const user = await this.findOne({email})
    if(!user) throw new Error("User Not Found !")
    const salt = user.salt
    const hashedPassword = user.password

    const userProvidedHash = createHmac("sha256",salt).update(password).digest("hex")

    if(hashedPassword !== userProvidedHash) throw new Error('Incorrect Password')
    
    return user
})

const User = mongoose.model("user",userSchema)

module.exports = User