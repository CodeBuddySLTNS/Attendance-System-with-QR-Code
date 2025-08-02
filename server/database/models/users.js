import { sqlQuery } from "../sqlQuery.js";

export const User = {
  getInfo: async (userId) => {
    return (
      await sqlQuery(`SELECT * FROM users WHERE userId = ?`, [userId])
    )[0];
  },
};
