import bcrypt from "bcryptjs";
import { sqlQuery } from "../sqlQuery.js";

export const User = {
  getByTeacherId: async (teacherId) => {
    return (
      await sqlQuery(`SELECT * FROM classes WHERE teacherId = ?`, [teacherId])
    )[0];
  },
  add: async ({ teacherId, className, departmentId, year }) => {
    return await sqlQuery(
      `INSERT INTO classes(teacherId, className, departmentId, year)
      VALUES (?, ?, ?, ?)`,
      [teacherId, className, departmentId, year]
    );
  },
};
