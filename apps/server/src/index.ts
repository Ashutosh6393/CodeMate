import express from "express";

const app = express();

//middlewares

app.use(express.json());

//routes

app.get("/", (req, res) => {
  res.send("Hello from server");
});

async function main() {
  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
}

main();
