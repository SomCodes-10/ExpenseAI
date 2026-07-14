import userModel from '../model/user.model.js';
import tokenBlackListModel from "../model/blacklist.model.js"
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/**
 * @name registerUserController
 * @description register a new user,expects username,email and password in the request body
 * @access Public
 */

async function registerUserController(req, res,next) {
  try{
  const { username, email, password } = req.body;

  const isUserAlreadyExists = await userModel.findOne({
    $or: [{ username }, { email }],
  });
  if (isUserAlreadyExists) {
    return res.status(400).json({
      message: 'Account with this Username and Email already exists',
    });
  }
  const hash = await bcrypt.hash(password, 10);
  const user = await userModel.create({
    username,
    email,
    password: hash,
  });
  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
  res.cookie('token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  });
  res.status(200).json({
    message: 'User registered successfully',
    token,
    user: { id: user.id, username: user.username, email: user.email },
  });
}catch(error){
  next(error);
}
}

/**
 * @name loginrUserController
 * @description Login a new user,expects username,email and password in the request body
 * @access Public
 */

async function loginUserController(req, res,next) {
  try{
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(400).json({
      message: 'User not found',
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({
      message: 'Given password is incorrect',
    });
  }
  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
  res.cookie('token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  });
  res.status(200).json({
    message: 'User logged in  successfully',
    token,
    user: { id: user.id, username: user.username, email: user.email },
  });
}catch(error){
  next(error);
}
}

/**
 * @name logoutUserController
 * @description Logut the  user
 * @access Public
 */

async function logoutUserController(req, res,next) {
  try{
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.startsWith('Bearer') ? authHeader.split(" ")[1]:null

  if(token){
    await tokenBlackListModel.create({token})
  }

  res.status(200).json({
    message: "User logged out successfully"
  })
}catch(error){
  next(error);
}
}

/**
 * @name getMeUserController
 * @description To fetch the data of teh user
 * @access Public
 */

async function getMeUserController(req,res,next) {
  try{
  const user = await userModel.findById(req.user.id)

  if(!user){
    return res.status(404).json({
      message: "User not found with this ID"
    })
  }

  res.status(200).json({
    message: "The data of the user is fetched successfully",
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    }
  })
}catch(error){
  next(error);
}
}


export default { registerUserController, loginUserController, logoutUserController , getMeUserController};
