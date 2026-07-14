import mongoose from "mongoose";

const aiReportSchema = new mongoose.Schema({
  userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true
    },
    month: {
      type: String,
      required: true
    },
    summary: {
      type: String,
      required: true
    },
    recommendations: {
      type: [String],
      default: []
    }, 
    aiHealthScore: {
      type: Number,
      required: true
    }
},{
  timestamps: true
})

aiReportSchema.index({userId: 1, month: 1},{unique: true})
const aiReportModel = mongoose.model("aiReport",aiReportSchema)
export default aiReportModel;