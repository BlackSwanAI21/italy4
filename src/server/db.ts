// Update User interface at the top
export interface User {
  id: string;
  email: string;
  password: string;
  name: string | null;
  companyName: string | null;
  openaiApiKey: string | null;
  logo: string | null;  // Add this line
  createdAt: string;
  updatedAt: string;
}

// Update schema initialization
async function initializeSchema() {
  await dbRun(`
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
  // ... rest of the schema initialization
}