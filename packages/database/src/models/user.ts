import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  discordId: string;
  username: string;
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  discordId: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, immutable: true }
}, {
  timestamps: true  // Automatically add createdAt and updatedAt timestamps
});

export const User = mongoose.model<IUser>('User', UserSchema);
