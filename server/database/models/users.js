import bcrypt from "bcryptjs";
import { sqlQuery } from "../sqlQuery.js";

export const User = {
  getInfo: async (userId) => {
    return (
      await sqlQuery(`SELECT * FROM users WHERE userId = ?`, [userId])
    )[0];
  },
  getInfoByUsername: async (username) => {
    return (
      await sqlQuery(`SELECT * FROM users WHERE username = ?`, [username])
    )[0];
  },
  add: async (name, username, password) => {
    const hashed = await bcrypt.hash(password, 10);
    return await sqlQuery(
      `INSERT INTO users(name, username, password, role, year)
      VALUES (?, ?, ?, 'teacher', 1)`,
      [name, username, hashed]
    );
  },
};
