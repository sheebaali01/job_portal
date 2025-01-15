import express from "express";
import dotenv from "dotenv"; 
import bodyParser from "body-parser";
import connectDB from "./utils/db.js";
import userRouter from "./routes/user.js"
import companyRouter from "./routes/company.js"
import jobRouter from "./routes/job.js"
import applicationRouter from "./routes/application.js"
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

const app = express();
dotenv.config();
connectDB();

const __dirname = path.resolve();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: "https://job-portal-gth27kd7j-sheebaali01s-projects.vercel.app",
    credentials: true
}));

const PORT = process.env.PORT || 3000;

app.use("/api/v1/user", userRouter);
app.use("/api/v1/company", companyRouter);
app.use("/api/v1/job", jobRouter);
app.use("/api/v1/application", applicationRouter);

app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.get('*',(req,res)=>{
    res.sendFile(path.resolve(__dirname,"frontend","dist","index.html"));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});