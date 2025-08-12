import express from "express";
import cors from "cors";
import dotenv, { config } from "dotenv";
import mongoose from 'mongoose'
import authRoute from './routes/authRouter.js'
import jobRoute from './routes/jobRouter.js'
const PORT = process.env.PORT || 5001
const app = express();

dotenv.config();
app.use(cors({
  origin: "https://danijobfind.vercel.app",
  methods: ["GET", "POST","DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"], // <-- Add "Authorization" here
  credentials: true
}));

app.use(express.json());

// db config

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Mongodb successfuly connected! ✅ '))
.catch((err) => console.error('Mongodb is failed! ❌', err.message))

// api config

app.use('/api/auth', authRoute)
app.use('/api/job', jobRoute)

app.listen(PORT, () => {
  console.log(`🚀 Server runing Port:${PORT}`);
});

