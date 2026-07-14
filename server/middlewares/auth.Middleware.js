import jwt from "jsonwebtoken"
import tokenBlackListModel from "../model/blacklist.model.js"

async function authUser(req,res,next) {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.startsWith("Bearer") ? authHeader.split(" ")[1]:null

  if(!token){
    return res.status(401).json({
      message: "Authorization token missing"
    })
  }

  try {
    const isTokenBlacklisted = await tokenBlackListModel.findOne({token})
    if(isTokenBlacklisted){
      return res.status(401).json({
        message: "Token has been revoked"
      })
    }

    const decoded = jwt.verify(token,process.env.JWT_SECRET)
    req.user = decoded

    next()
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token"
    })
  }
}

export default authUser;