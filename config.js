import dotenv from "dotenv";

dotenv.config();

const config = {
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },
  port: process.env.PORT || 3030,
  jwtSecret: process.env.JWT_SECRET || "some_secret",
};

export default config;
