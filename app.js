import express from "express";
import helmet from "helmet";
import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";

import userRoutes from "./routes/users.js";
import ticketRoutes from "./routes/tickets.js";
import config from "./config.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
// app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extend: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use("/api/users", userRoutes);
app.use("/api/tickets", ticketRoutes);

app.listen(config.port, () => {
  console.log(`Server started on port ${config.port}`);
});
