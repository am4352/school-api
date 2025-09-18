import express from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

import schoolRoutes from './routes/schools.js';
dotenv.config();
const app = express();
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('✅ API is working!');
});
app.get("/test", async (req, res) => {
  try {
    const schools = await prisma.school.findMany();
    res.json(schools);
  } catch (err) {
    res.status(500).json({ message: "DB error", error: err.message });
  }
});

app.use('/api', schoolRoutes);
console.log("testing")
// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});



// hello from anuj mishra 