import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import connection from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import YAML from "yaml";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(cookieParser());
const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));

app.use(morgan("tiny"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", userRoutes);
app.use("/api/v1", bookRoutes);
app.use("/api/v1", categoryRoutes);

// swagger api-docs
const file = fs.readFileSync("swagger.yml", "utf8");
const swaggerDocument = YAML.parse(file);
// console.log(swaggerDocument);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req, res, next) => {
  return res.status(200).send({
    message: "API Health Check : Working Perfectly",
  });
});

app.listen(PORT, () => {
  console.log(`listening at port http://localhost:${PORT} `);
});
