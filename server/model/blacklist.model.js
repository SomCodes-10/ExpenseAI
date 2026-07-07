import mongoose from 'mongoose';

const blacklistModelSchema = new mongoose.Schema({
  token: {
    type: String,
    required: [true, 'Token is required'],
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '24h',
  }
});

const tokenBlackListModel = mongoose.model(
  'blacklistTokens',
  blacklistModelSchema
);

export default tokenBlackListModel;
