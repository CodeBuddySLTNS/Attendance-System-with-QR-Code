import { sqlQuery } from "../sqlQuery.js";

export const Attendance = {
  getByDate: async (date) => {
    return await sqlQuery(
      `
      SELECT 
        u.userId, u.name, CONCAT(d.acronym, " ", u.year) AS courseAndYear, 
        a.type, a.date
      FROM attendances a
      JOIN users u ON a.userId = u.userId
      JOIN users d ON d.departmentId = u.departmentId
      WHERE DATE(a.date) = ?
    `,
      [date]
    );
  },

  add: async (userId, type, date) => {
    return await sqlQuery(
      `INSERT INTO attendances (userId, type, date) VALUES (?, ?, ?)`,
      [userId, type, date]
    );
  },
};
