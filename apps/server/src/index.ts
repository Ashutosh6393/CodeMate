import { errorHandler } from "./middlewares/errorHandler.js";
import { logs } from "./middlewares/logs.js";
import cookieParser from "cookie-parser";
import router from "./routes/index.js";
import express from "express";
import cors, { CorsOptions } from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

//middlewares

const allowedOrigins = [
  "https://codemate.v8coder.com",
  "http://localhost:5173",
];

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., Postman, curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

app.use(logs);

//routes
app.use("/api/v1", router);

// global error handler
app.use(errorHandler);

async function main() {
  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
}

main();
