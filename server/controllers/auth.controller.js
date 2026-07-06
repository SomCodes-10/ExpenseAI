import userModel from "../model/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

/**
 * @name registerUserController
 * @description register a new user,expects username,email and password in the request body
 * @access Public
 */

async function registerUserController(req, res) {
  const { username, email, password } = req.body
  if (!username || !email || !password) {
    return res.status(400).json({
      message: "Please provide username,email and password"
    })
  }
  const isUserAlreadyExists = await userModel.findOne({
    $or: [{ username }, { email }]
  }
  )
  if (isUserAlreadyExists) {
    return res.status(400).json({
      message: "Account with this Username and Email already exists"
    })
  }
  const hash = await bcrypt.hash(password, 10)
  const user = await userModel.create({
    username,
    email,
    password: hash
  })
  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  )
  res.cookie("token", token,
    {
      httpOnly: true,
      secure: true,
      sameSite: "none"
    })
  res.status(200).json({
    message: "User registered successfully",
    token,
    user: { id: user._id, username: user.username, email: user.email }
  })
}

/**
 * @name loginrUserController
 * @description Login a new user,expects username,email and password in the request body
 * @access Public
 */

async function loginUserController(req, res) {
  const { email, password } = req.body

  const user = await userModel.findOne({ email })

  if (!user) {
    return res.status(400).json({
      message: "User not found"
    })
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) {
    return req.status(400).json({
      message: "Given password is incorrect"
    })
  }
  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  )
  res.cookie("token", token,
    {
      httpOnly: true,
      secure: true,
      sameSite: "none"
    })
  res.status(200).json({
    message: "User logged in  successfully",
    token,
    user: { id: user._id, username: user.username, email: user.email }
  })
}

export default {registerUserController,loginUserController}