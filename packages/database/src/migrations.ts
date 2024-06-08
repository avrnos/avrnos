//     ╭───────────────────────────────────────────╮
//     │             Copyright (c)                 │
//     │           ────────────────                │
//     │        Avrnos, All Rights Reserved        │
//     ╰───────────────────────────────────────────╯

import { Database } from '../index';

async function migrate() {
  const db = Database.getInstance();
  await db.connect('mongodb://localhost:27017/discordbot');

  try {
    // Example migration: Add a new field to all users
    await db.getUserModel().updateMany({}, { $set: { newField: 'defaultValue' } });
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await db.disconnect();
  }
}

migrate().catch(console.error);