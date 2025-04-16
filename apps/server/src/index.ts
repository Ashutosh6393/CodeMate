import express from "express";
import router from "./routes/index.js";
import cookieParser from "cookie-parser";
import { authCheck } from "./middlewares/authCheck.js";

const app = express();

//middlewares

app.use(express.json());
app.use(cookieParser());

//routes
app.use("/api/v1", router);

async function main() {
  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
}

main();
