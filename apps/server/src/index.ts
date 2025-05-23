import { errorHandler } from "./middlewares/errorHandler.js";
import { logs } from "./middlewares/logs.js";
import cookieParser from "cookie-parser";
import router from "./routes/index.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

//middlewares

app.use(
  cors({
    origin: "https://codemate.v8coder.com",
    credentials: true,
  }),
);
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
