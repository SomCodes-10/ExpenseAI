import { body,validationResult } from "express-validator";

const registerRules = [
  body('username').trim().notEmpty().withMessage("Username can not be empty"),
  body('email').isEmail().withMessage("Please provide a valid Email").normalizeEmail(),
  body('password').isLength({min: 6}).withMessage("Password must contain atleast 6 characters")
]

const loginRules = [
  body('email').isEmail().withMessage("Please provide a valid Email").normalizeEmail(),
  body('password').isLength({min: 6}).withMessage("Password must contain atleast 6 characters")
]

const handleValidationErrors = (req,res,next) =>{
  const errors = validationResult(req)
  if(!errors.isEmpty()){
      return res.status(400).json({
        errors: errors.array()
      })
  }
  next();
}

 const registerValidator = [...registerRules,handleValidationErrors]
 const loginValidator = [...loginRules,handleValidationErrors]

 export {registerValidator,loginValidator}
