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

  const user = await User.getInfoByUsername(username);

  if (user) {
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new CustomError("Incorrect credentials", status.BAD_REQUEST);
    }

    const token = generateToken({ userId: user.userId });
    const userData = await User.getInfo(user.userId);
    delete userData.password;

    return res.json({ token, user: userData });
  } else {
    throw new CustomError("Incorrect credentials", status.BAD_REQUEST);
  }
};

const session = async (req, res) => {
  const user = await User.getInfo(res.locals.userId);
  delete user.password;

  res.send(user);
};

const signup = async (req, res) => {
  const { name, username, password } = req.body;

  if (!name || !username || !password) {
    throw new CustomError("Missing fields are required.", status.BAD_REQUEST);
  }

  const result = await User.add(name, username, password);
  res.send(result);
};

export default {
  login,
  session,
  signup,
};
