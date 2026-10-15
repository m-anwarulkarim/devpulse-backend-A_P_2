import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../../config/db.config";
import { envConfig } from "../../config/env.config";
import { AppError } from "../../utils/AppError";

const signupUser = async (payload: any) => {
  const { name, email, password, role = "contributor" } = payload;

  if (!name || !email || !password) {
    throw new AppError(400, "Name, email, and password are required");
  }

  // check if user already exists
  const existingUser = await pool.query(
    "SELECT id FROM users WHERE email = $1",
    [email.toLowerCase()]
  );

  if (existingUser.rows.length > 0) {
    throw new AppError(400, "An account with this email already exists");
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, envConfig.bcryptSaltRounds);

  const result = await pool.query(
    `INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, role, created_at, updated_at`,
    [name.trim(), email.toLowerCase().trim(), hashedPassword, role]
  );

  return result.rows[0];
};

const loginUser = async (payload: any) => {
  const { email, password } = payload;

  if (!email || !password) {
    throw new AppError(400, "Email and password are required");
  }

  // find user
  const result = await pool.query(
    "SELECT id, name, email, password, role, created_at, updated_at FROM users WHERE email = $1",
    [email.toLowerCase().trim()]
  );

  const user = result.rows[0];
  if (!user) {
    throw new AppError(401, "Invalid email or password");
  }

  // check password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError(401, "Invalid email or password");
  }

  // create jwt token
  const token = jwt.sign(
    { id: user.id, name: user.name, role: user.role },
    envConfig.jwtSecret,
    { expiresIn: "7d" }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at,
    },
  };
};

export const AuthService = {
  signupUser,
  loginUser,
};
