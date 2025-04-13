import express from "express";
import router from "./routes/index.js";

const app = express();

//middlewares

app.use(express.json());
app.use('/api/v1', router);
//routes


async function main() {
  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
}

main();
