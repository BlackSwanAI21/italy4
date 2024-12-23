import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { serverDb, initializeDatabase } from './db/index.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Store webhooks in memory for demo purposes
let webhooks: { timestamp: string; payload: any; userFound?: boolean }[] = [];

// Configure CORS
const corsOptions = {
  origin: '*', // Allow all origins for demo purposes
  methods: ['GET', 'POST', 'DELETE'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Initialize database when server starts
initializeDatabase().catch((error: Error) => {
  console.error('Failed to initialize database:', error);
  process.exit(1);
});

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Serve static files from the Vite build output
app.use(express.static(path.join(__dirname, '../../dist')));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// Get webhooks endpoint
app.get('/api/webhooks', (req: Request, res: Response) => {
  res.json(webhooks);
});

// Clear webhooks endpoint
app.delete('/api/webhooks', (req: Request, res: Response) => {
  webhooks = [];
  res.status(200).json({ success: true });
});

// Universal webhook endpoint
app.post('/api/webhook', async (req: Request, res: Response) => {
  const { 'Lead Response': message, 'app email': email, 'Active Assistant ID': assistantId } = req.body;
  
  let userFound = false;
  
  try {
    // Check if user exists
    if (email) {
      const user = await serverDb.users.findByEmail(email);
      userFound = !!user;
      console.log('User lookup result:', { email, found: userFound });
    }

    const webhook = {
      timestamp: new Date().toISOString(),
      payload: req.body,
      userFound
    };
    
    // Store webhook at the beginning of the array
    webhooks.unshift(webhook);
    
    // Keep only last 50 webhooks
    if (webhooks.length > 50) {
      webhooks = webhooks.slice(0, 50);
    }

    // Return the webhook data with user verification result
    res.status(200).json({
      timestamp: webhook.timestamp,
      payload: webhook.payload,
      userFound
    });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({
      error: 'Internal server error',
      timestamp: new Date().toISOString()
    });
  }
});

// Share endpoint
app.get('/share/:agentId', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../dist/index.html'));
});

// Serve the React app for all other routes
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../dist/index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});