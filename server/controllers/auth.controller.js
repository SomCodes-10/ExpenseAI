import userModel from "../model/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

async function registerUserController(req,res) {
  const {username,email,password} = req.body
  if(!username || !email || !passowrd){
    return res.status.json(400)({
      message: "Please provide username,email and password"
    })
  }
  const isUserAlreadyExists = userModel.findOne({
    $or: [{username},{email}]
  }
  )
  if(isUserAlreadyExists){
    return res.status.json(400)({
      message: "Account with this Username and Email already exists"
    })
  }
}

export default registerUserController