import { body, validationResult } from "express-validator";

const expenseCategories = [
  "Food & Dining", "Groceries", "Transportation", "Shopping",
  "Bills & Utilities", "Entertainment", "Healthcare", "Education",
  "Travel", "Investments", "EMI / Loans"
];

const incomeCategories = [
  "Salary", "Freelancing", "Investments", "Bonus", "Gift", "Other"
];

const transactionValidationRules = [
  body('amount').notEmpty().withMessage("Amount can not be null")
    .isNumeric().withMessage("Amount must be a number")
    .custom((value) => {
      if (value <= 0) {
        throw new Error("Amount must be greater than 0")
      }
      return true;
    }),
  body('type').notEmpty().withMessage("Type is mandatory").isIn(['income', 'expense']).withMessage("Type must be either income or expense"),

  body('category').notEmpty().withMessage("Category can not be empty")
    .custom((value, { req }) => {
      const type = req.body.type
      if (type === 'income' && !incomeCategories.includes(value)) {
        throw new Error(`'${value}' is not valid income category!`);
      }
      if (type === "expense" && !expenseCategories.includes(value)) {
        throw new Error(`'${value}'is not valid expense category!`);
      }
      return true;
    }),
   body('date').notEmpty().withMessage("Date cannot be empty").isISO8601().withMessage("Date must be in ISO 8601 format")
               .custom((value) =>{
                const inputDate = new Date(value)
                const today = new Date()
                today.setHours(0,0,0,0)
                if (inputDate > today){
                  throw new Error("Are you from future Mate? Date cannot be greater than today")
                }
                return true
               })

];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({ field: err.path, message: err.msg }))
    });
  }
   next();
}

const validateResult = [...transactionValidationRules,handleValidationErrors]
export {validateResult}