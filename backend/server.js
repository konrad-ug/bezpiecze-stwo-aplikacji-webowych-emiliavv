import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import fs from 'fs/promises';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

function getPublicKey() {
  return process.env.PUBLIC_KEY.replace(/\\n/g, '\n');
}

//Middleweare
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, getPublicKey(), { algorithms: ['RS256'] }, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = decoded;
    next();
  });
}

const ORDERS_FILE = new URL('./orders.json', import.meta.url).pathname;

async function readOrders() {
  try {
    const data = await fs.readFile(ORDERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading orders:', error);
    return [];
  }
}

async function writeOrders(orders) {
  try {
    await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2));
  } catch (error) {
    console.error('Error writing orders:', error);
    throw error;
  }
}

// GET zamówienia
app.get('/api/order-history', authenticateToken, async (req, res) => {
  try {
    const username = req.user.preferred_username;
    const roles = req.user.realm_access?.roles || [];
    const orders = await readOrders();

    if (roles.includes('admin')) {
      return res.json(orders);
    } else {
      return res.json(orders.filter(o => o.user === username));
    }
  } catch (error) {
    console.error('Error getting orders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST nowe zamówienie
app.post('/api/order-history', authenticateToken, async (req, res) => {
  try {
    const username = req.user.preferred_username;
    const newOrder = {
      id: Date.now(),
      user: username,
      date: new Date().toISOString(),
      items: req.body.items,
      total: req.body.total,
      status: 'pending'
    };

    const orders = await readOrders();
    orders.push(newOrder);
    await writeOrders(orders);

    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Mock API działa na http://localhost:${PORT}`);
});
