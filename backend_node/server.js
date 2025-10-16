import 'dotenv/config';
import express from 'express';
import cors from "cors";
import { v2 as cloudinary } from 'cloudinary';
import socialRouter from "./routes/social-analysis-router.js";
import crmRouter from "./routes/crm-router.js";
import authRouter from "./routes/auth-router.js";
import {sequelize} from './models/index.js';
import cookieParser from 'cookie-parser';

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URLS.split(","), 
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"]
}));
app.use(cookieParser())
app.use(express.json());

const port = process.env.PORT || 4000;

app.use("/api/crm", crmRouter);
app.use("/api/social", socialRouter);
app.use("/api/auth", authRouter);
app.use("/api/test", (req,res,next)=>{
  res.status(200).json({message: "this is test", frontend: process.env.FRONTEND_URL, database: process.env.DB_HOST})
})


app.listen(port , async ()=>{
  console.log(`Server is running on port ${port}`);
  try{
    await sequelize.authenticate();
    console.log("Connected to postgreSQL database successfully.");
    
    await sequelize.sync({ alter: true }); // This is not recommended in production
    console.log("All models were synchronized successfully.");
  }catch(error){
    console.log("Database connection error", error);
  }
});
