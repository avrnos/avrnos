import mongoose from 'mongoose';
import { User, IUser } from './models/user';

class Database {
  // ... existing code

  public async createUser(discordId: string, username: string): Promise<IUser> {
    const user = new User({ discordId, username });
    return await user.save();
  }

  public async getUser(discordId: string): Promise<IUser | null> {
    return await User.findOne({ discordId });
  }

  public async updateUser(discordId: string, username: string): Promise<IUser | null> {
    return await User.findOneAndUpdate({ discordId }, { username }, { new: true });
  }

  public async deleteUser(discordId: string): Promise<IUser | null> {
    return await User.findOneAndDelete({ discordId });
  }
}

export default Database;