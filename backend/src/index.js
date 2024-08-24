import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import apiRoutes from './routes/api.js';
import cors from "cors";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

//db connection
connectDB();

//middleware
app.use(express.json());
app.use(cors());

//routes
app.use('/api',apiRoutes);

app.get('/',(req, res)=>{
    res.send("Api is working...");
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
});