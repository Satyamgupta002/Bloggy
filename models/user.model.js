const {Schema} = require('mongoose')
const {createHmac, randomBytes} = require("crypto")
const mongoose = require('mongoose')
const {createTokenForUser} = require('../services/authentication.js')

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

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    const salt = randomBytes(16).toString("hex");
    this.salt = salt;
    this.password = createHmac("sha256", salt)
        .update(this.password)
        .digest("hex");
});


userSchema.static("matchPasswordAndGenerateToken",async function (email,password){  // to match the password
    const user = await this.findOne({email})
    if(!user) throw new Error("User Not Found !")
    const salt = user.salt
    const hashedPassword = user.password

    const userProvidedHash = createHmac("sha256",salt).update(password).digest("hex")

    if(hashedPassword !== userProvidedHash) throw new Error('Incorrect Password')
    
    const token = createTokenForUser(user)
    return token
})

const User = mongoose.model("user",userSchema)

module.exports = User