//     ╭───────────────────────────────────────────╮
//     │             Copyright (c)                 │
//     │           ────────────────                │
//     │        Avrnos, All Rights Reserved        │
//     ╰───────────────────────────────────────────╯

import mongoose from 'mongoose';
import { IUser, User } from './src/models/user'; // Update path as necessary

export class Database {
  private static instance: Database;
  private mongooseConnection: mongoose.Connection;

  private constructor() {
    this.mongooseConnection = mongoose.createConnection();
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async connect(uri: string): Promise<void> {
    const options = {
        useNewUrlParser: true, // Valid option for the latest Mongoose version
        useUnifiedTopology: true, // Valid option for the latest Mongoose version
        useCreateIndex: true, // Valid option for the latest Mongoose version
    };

    try {
        await this.mongooseConnection.openUri(uri);
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection error:', error);
    }
}

  public async disconnect(): Promise<void> {
    try {
      await this.mongooseConnection.close();
      console.log('Database disconnected successfully');
    } catch (error) {
      console.error('Database disconnection error:', error);
    }
  }

  public getUserModel() {
    return this.mongooseConnection.model<IUser>('User', User.schema);
  }

  public async createUser(discordId: string, username: string): Promise<IUser | null> {
    const user = new (this.getUserModel())({
      discordId,
      username,
      createdAt: new Date(),
    });

    try {
      await user.save();
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  public async getUser(discordId: string): Promise<IUser | null> {
    try {
      const user = await this.getUserModel().findOne({ discordId });
      return user;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  public async updateUser(discordId: string, username: string): Promise<IUser | null> {
    try {
      const user = await this.getUserModel().findOneAndUpdate(
        { discordId },
        { username },
        { new: true }
      );
      return user;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  public async deleteUser(discordId: string): Promise<IUser | null> {
    try {
      const user = await this.getUserModel().findOneAndDelete({ discordId });
      return user;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
}
