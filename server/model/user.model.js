import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username:{
    type: String,
    unique: [true, "Username already taken"],
    required: true,
    trim: true
  },
  email:{
    type: String,
    unique: [true,"Account already exists wih this email address"],
    required: true,
    trim: true,
    lowercase: true
  },
  password:{
    type: String,
    required: [true,"Password is required"],
  },
},
{
  timestamps: true
})

const userModel = mongoose.model('User', userSchema);

export default userModel