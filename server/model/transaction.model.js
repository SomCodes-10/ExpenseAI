import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  type: {
    type: String,
    enum: ['income','expense'],
    required: [true,'PLease specify if it is income or expense']
  },
  amount: {
    type: Number,
    required: [true,'Please add an amount']
  },
  category: {
    type: String,
    required: [true,'PLease select a category']
  },
  date: {
    type: Date,
    default: Date.now
  },
  description:{
    type: String,
    trim: true,
    maxlength: [50, 'Description cannot be more than 50 characters']
  }
},{
  timestamps: true
});

transactionSchema.index({userId: 1, date: -1})
transactionSchema.index({userId: 1, category: 1})

const transactionModel = mongoose.model('Transaction',transactionSchema)
export default transactionModel