import express from "express";
import router from "./routes/index.js";
import cookieParser from "cookie-parser";
import { authCheck } from "./middlewares/authCheck.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

//middlewares

app.use(express.json());
app.use(cookieParser());

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
