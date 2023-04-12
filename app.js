import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import connection from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(cookieParser());
app.use(cors());
app.use(morgan("tiny"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", userRoutes);
app.use("/api/v1", bookRoutes);
app.use("/api/v1", categoryRoutes);

app.get("/", (req, res, next) => {
  return res.status(200).send({
    message: "API Health Check",
  });
});

app.listen(PORT, () => {
  console.log(`listening at port http://localhost:${PORT} `);
});
