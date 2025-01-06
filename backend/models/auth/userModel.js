const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: [true, "Please provide your name"],
      },
  
      email: {
        type: String,
        required: [true, "Please an email"],
        unique: true,
        trim: true,
        match: [
          /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
          "Please add a valid email",
        ],
      },
      password: {
        type: String,
        required: [true, "Please add password!"],
      },
  
      photo: {
        type: String,
        default: "https://avatars.githubusercontent.com/u/19819005?v=4",
      },
  
      bio: {
        type: String,
        default: "I am a new user.",
      },
  
      role: {
        type: String,
        enum: ["user", "admin", "creator"],
        default: "user",
      },
  
      isVerified: {
        type: Boolean,
        default: false,
      },
    },
    { timestamps: true, minimize: true }
  );
  

// hash the password before saving
UserSchema.pre("save", async function(next){
  //check if the password is not modified
  if(!this.isModified("password")){
    return next();
  }

  //hash the password ==> using bcrypt 
  //generate salt
  const salt = await bcrypt.genSalt(10);
  //hash the pass wit th salt
  const hashedPassword = await bcrypt.hash(this.password, salt);
  //set the pass to the hashed pass
  this.password =  hashedPassword;

  //call the next middleware
  next();

})

const User = mongoose.model('User', UserSchema);

module.exports = User;