import express from "express";
import authRoute from "./routes/auth.route.js";
import postRoute from "./routes/post.route.js"
import cookieParser from "cookie-parser";
import cors from "cors";
import testRoute from "./routes/test.route.js";
import userRoute from "./routes/user.route.js";

const app = express();

app.use(
  cors({
    origin: process.env.NODE_ENV === "production" ? process.env.CLIENT_URL : "http://localhost:5173",
    credentials: true,
    exposedHeaders: ["set-cookie"],
  })
);
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/test", testRoute);
app.use("/api/users", userRoute);
app.get("/health", (req, res) => res.sendStatus(200));

app.listen(8800, () => {
  console.log("Server is running");
});