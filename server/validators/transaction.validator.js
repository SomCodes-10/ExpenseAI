import { body, validationResult } from "express-validator";

const expenseCategories = [
  "Food & Dining", "Groceries", "Transportation", "Shopping",
  "Bills & Utilities", "Entertainment", "Healthcare", "Education",
  "Travel", "Investments", "EMI / Loans"
];

const incomeCategories = [
  "Salary", "Freelancing", "ROI", "Bonus", "Gift", "Other"
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
               .custom((value) => {
                 // Compare as local date strings to avoid UTC vs local timezone mismatch.
                 // new Date("2026-07-16") parses as UTC midnight, which is ahead of
                 // local midnight in IST (+5:30), causing today's date to fail the check.
                 const inputDateStr = new Date(value).toISOString().split('T')[0];
                 const todayStr = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD in local time
                 if (inputDateStr > todayStr) {
                   throw new Error("Are you from future Mate? Date cannot be greater than today");
                 }
                 return true;
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