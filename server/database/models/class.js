import bcrypt from "bcryptjs";
import { sqlQuery } from "../sqlQuery.js";

export const Class = {
  getByTeacherId: async (teacherId) => {
    return await sqlQuery(
      `SELECT c.*, d.acronym AS department FROM classes c
      INNER JOIN departments d ON c.departmentId = d.departmentId
      WHERE teacherId = ?`,
      [teacherId]
    );
  },
  add: async ({ teacherId, className, departmentId, year, time }) => {
    return await sqlQuery(
      `INSERT INTO classes(teacherId, className, departmentId, year, time)
      VALUES (?, ?, ?, ?, ?)`,
      [teacherId, className, departmentId, year, time]
    );
  },
};
