const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const router = require("./routers/router.js");
const connectDB = require("./db/connect.js");
const { setupGeminiChat } = require("./gemini/chat.js");
const mongoose = require("mongoose");


dotenv.config();

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
    exposedHeaders: ["set-cookie", "token"],
  })
);
// parse form data
app.use(express.urlencoded({ extended: false }));
// parse json
app.use(express.json());
// parse cookie
app.use(cookieParser());

app.use(router);

const initServer = async () => {
  try {
    const port = (process.env.SERVER_PORT) || 8000;
    await mongoose
    .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));
    // init gemini
    await setupGeminiChat();

    app.listen(port, () => {
      console.log(`Backend Server Started on ${port} ...`);
    });
  } catch (err) {
    console.log(err.message);
    console.log("Server not started!");
  }
};
initServer();
