import db from "../databases/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import { validateUser } from "../utils/validation.js";
import config from "../config.js";

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the user already exists
    const [existingUser] = await db.query(
      "SELECT * FROM user_details WHERE email = ?",
      [email]
    );
    if (existingUser.length) {
      return res
        .status(409)
        .json({ message: "User with this email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the user into the database
    await db.query(
      "INSERT INTO user_details (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    res.json({ message: "Registration successful" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Retrieve the user from the database
    const [user] = await db.query(
      "SELECT * FROM user_details WHERE email = ?",
      [email]
    );
    if (!user.length) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if the password matches
    const passwordMatch = await bcrypt.compare(password, user[0].password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // // Generate a JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      config.jwtSecret,
      {
        expiresIn: "1h",
      }
    );

    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
