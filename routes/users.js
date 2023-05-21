import express from "express";
import { validateUser } from "../utils/validation.js";

import { loginUser, registerUser } from "../controllers/users.js";

const router = express.Router();

router.post("/register", validateUser, registerUser);

router.post("/login", loginUser);

export default router;
