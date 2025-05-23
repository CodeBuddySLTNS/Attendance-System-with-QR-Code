import { sqlQuery } from "../sqlQuery.js";

export const Attendance = {
  getByDate: async (date) => {
    return await sqlQuery(
      `
      SELECT 
        u.userId, u.name, CONCAT(d.acronym, " ", u.year) AS courseAndYear, 
        a.type, a.dateTime AS date
      FROM attendances a
      JOIN users u ON a.userId = u.userId
      JOIN departments d ON d.departmentId = u.departmentId
      WHERE DATE(a.date) = ?
      ORDER BY a.dateTime ASC
    `,
      [date]
    );
  },

  add: async (userId, type, dateTime, date) => {
    return await sqlQuery(
      `INSERT INTO attendances (userId, type, dateTime, date) VALUES (?, ?, ?, ?)`,
      [userId, type, dateTime, date]
    );
  },

  deleteByUserIdDate: async (userId, date) => {
    return await sqlQuery(`DELETE attendances WHERE userId = ? AND date = ?`, [
      userId,
      date,
    ]);
  },
};
