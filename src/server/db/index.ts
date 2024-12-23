import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { dbRun, dbGet, dbAll } from './utils';
import type { User, AIAgent, Chat, Message } from './types';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '../../../data/database.sqlite');

// Ensure the data directory exists
import { mkdirSync } from 'fs';
mkdirSync(path.dirname(dbPath), { recursive: true });

// Create database connection
const db = new sqlite3.Database(dbPath);

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

// Initialize database schema
async function initializeSchema() {
  await dbRun(db, `
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE,
      password TEXT,
      name TEXT,
      companyName TEXT,
      openaiApiKey TEXT,
      logo TEXT,
      createdAt TEXT,
      updatedAt TEXT
    )
  `);

  await dbRun(db, `
    CREATE TABLE IF NOT EXISTS aiAgents (
      id TEXT PRIMARY KEY,
      name TEXT,
      description TEXT,
      config TEXT,
      userId TEXT,
      webhookSecret TEXT,
      createdAt TEXT,
      updatedAt TEXT,
      FOREIGN KEY (userId) REFERENCES users(id)
    )
  `);

  await dbRun(db, `
    CREATE TABLE IF NOT EXISTS chats (
      id TEXT PRIMARY KEY,
      agentId TEXT,
      userId TEXT,
      threadId TEXT,
      source TEXT,
      metadata TEXT,
      createdAt TEXT,
      updatedAt TEXT,
      FOREIGN KEY (agentId) REFERENCES aiAgents(id),
      FOREIGN KEY (userId) REFERENCES users(id)
    )
  `);

  await dbRun(db, `
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      chatId TEXT,
      role TEXT,
      content TEXT,
      createdAt TEXT,
      FOREIGN KEY (chatId) REFERENCES chats(id)
    )
  `);

  // Create indexes
  await dbRun(db, 'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
  await dbRun(db, 'CREATE INDEX IF NOT EXISTS idx_aiagents_userid ON aiAgents(userId)');
  await dbRun(db, 'CREATE INDEX IF NOT EXISTS idx_chats_agentid ON chats(agentId)');
  await dbRun(db, 'CREATE INDEX IF NOT EXISTS idx_messages_chatid ON messages(chatId)');
}

// Database operations
export const serverDb = {
  users: {
    async findByEmail(email: string): Promise<User | undefined> {
      return dbGet<User>(db, 'SELECT * FROM users WHERE email = ? COLLATE NOCASE', [email]);
    },
    async findById(id: string): Promise<User | undefined> {
      return dbGet<User>(db, 'SELECT * FROM users WHERE id = ?', [id]);
    },
    async create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      await dbRun(db, `
        INSERT INTO users (id, email, password, name, companyName, openaiApiKey, logo, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [id, user.email.toLowerCase(), user.password, user.name, user.companyName, user.openaiApiKey, user.logo, now, now]);
      
      const created = await this.findById(id);
      if (!created) throw new Error('Failed to create user');
      return created;
    },
    async update(id: string, data: Partial<User>): Promise<User | undefined> {
      const now = new Date().toISOString();
      const user = await this.findById(id);
      if (!user) return undefined;

      const updates = Object.entries(data)
        .filter(([key]) => key !== 'id' && key !== 'createdAt')
        .map(([key, value]) => `${key} = ?`);

      if (updates.length === 0) return user;

      const query = `
        UPDATE users 
        SET ${updates.join(', ')}, updatedAt = ? 
        WHERE id = ?
      `;

      const values = [
        ...Object.entries(data)
          .filter(([key]) => key !== 'id' && key !== 'createdAt')
          .map(([, value]) => value),
        now,
        id
      ];

      await dbRun(db, query, values);
      return this.findById(id);
    }
  },
  aiAgents: {
    async findById(id: string): Promise<AIAgent | undefined> {
      return dbGet<AIAgent>(db, 'SELECT * FROM aiAgents WHERE id = ?', [id]);
    },
    async findByUserId(userId: string): Promise<AIAgent[]> {
      return dbAll<AIAgent>(db, 'SELECT * FROM aiAgents WHERE userId = ?', [userId]);
    },
    async create(agent: Omit<AIAgent, 'id' | 'webhookSecret' | 'createdAt' | 'updatedAt'>): Promise<AIAgent> {
      const id = crypto.randomUUID();
      const webhookSecret = crypto.randomUUID();
      const now = new Date().toISOString();
      
      await dbRun(db, `
        INSERT INTO aiAgents (id, name, description, config, userId, webhookSecret, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [id, agent.name, agent.description, agent.config, agent.userId, webhookSecret, now, now]);
      
      const created = await this.findById(id);
      if (!created) throw new Error('Failed to create agent');
      return created;
    }
  },
  chats: {
    async findById(id: string): Promise<Chat | undefined> {
      return dbGet<Chat>(db, 'SELECT * FROM chats WHERE id = ?', [id]);
    },
    async create(chat: Omit<Chat, 'id' | 'createdAt' | 'updatedAt'>): Promise<Chat> {
      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      
      await dbRun(db, `
        INSERT INTO chats (id, agentId, userId, threadId, source, metadata, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [id, chat.agentId, chat.userId, chat.threadId, chat.source, chat.metadata, now, now]);
      
      const created = await this.findById(id);
      if (!created) throw new Error('Failed to create chat');
      return created;
    }
  },
  messages: {
    async findById(id: string): Promise<Message | undefined> {
      return dbGet<Message>(db, 'SELECT * FROM messages WHERE id = ?', [id]);
    },
    async create(message: Omit<Message, 'id' | 'createdAt'>): Promise<Message> {
      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      
      await dbRun(db, `
        INSERT INTO messages (id, chatId, role, content, createdAt)
        VALUES (?, ?, ?, ?, ?)
      `, [id, message.chatId, message.role, message.content, now]);
      
      const created = await this.findById(id);
      if (!created) throw new Error('Failed to create message');
      return created;
    }
  }
};

// Initialize database
export async function initializeDatabase() {
  try {
    await initializeSchema();
    
    // Create test user if it doesn't exist
    const testEmail = 'jamie@blackswaninfluence.com';
    const existingUser = await serverDb.users.findByEmail(testEmail);
    
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('testpassword123', 10);
      await serverDb.users.create({
        email: testEmail,
        password: hashedPassword,
        name: 'Jamie',
        companyName: 'Black Swan Influence',
        openaiApiKey: process.env.VITE_OPENAI_API_KEY || null,
        logo: null
      });
      console.log('Test user created successfully');
    }
    
    console.log('Server database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize server database:', error);
    throw error;
  }
}