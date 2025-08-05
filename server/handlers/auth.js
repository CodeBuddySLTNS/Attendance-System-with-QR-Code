import status from "http-status";
import bcrypt from "bcryptjs";
import { CustomError, generateToken } from "../lib/utils.js";
import { sqlQuery } from "../database/sqlQuery.js";
import { User } from "../database/models/users.js";

const login = async (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    throw new CustomError("Missing fields are required.", status.BAD_REQUEST);
  }

  const admin = await sqlQuery(
    `SELECT * FROM users WHERE name = ? AND role = "admin"`,
    [username]
  );

  if (admin[0]) {
    const isMatch = await bcrypt.compare(password, admin[0].password);

    if (!isMatch) {
      throw new CustomError("Incorrect credentials", status.BAD_REQUEST);
    }

    const token = generateToken({ userId: admin[0].userId });
    const user = await User.getInfo(admin[0].userId);
    delete user.password;

    return res.json({ token, user });
  } else {
    throw new CustomError("Incorrect credentials", status.BAD_REQUEST);
    // const hashed = await bcrypt.hash(password, 10);
    // const result = await sqlQuery(
    //   `INSERT INTO users(name, password, role, year)
    //   VALUES (?, ?, 'admin', 1)`,
    //   [username, hashed]
    // );

    // if (result.insertId) {
    //   const token = generateToken({ userId: result.insertId });
    //   return res.json({ token });
    // }
  }
};

const session = async (req, res) => {
  const user = await User.getInfo(res.locals.userId);
  delete user.password;

  res.send(user);
};

export default {
  login,
  session,
};
