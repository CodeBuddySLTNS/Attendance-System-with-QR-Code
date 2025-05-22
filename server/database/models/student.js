import { sqlQuery } from "../sqlQuery.js";

export const Student = {
  getAll: async () => {
    return await sqlQuery(`
      SELECT 
        u.userId, u.studentId, u.name, d.departmentName, d.acronym AS departmentAcronym, u.year
      FROM users u 
      JOIN departments d 
        ON u.departmentId = d.departmentId
      WHERE u.role = "student"
    `);
  },

  add: async (student) => {
    const query = `
      INSERT INTO users (studentId, name, departmentId, year)
      VALUES (?, ?, ?, ?)`;
    const params = [
      student.studentId,
      student.name,
      student.departmentId,
      student.year,
    ];
    return await sqlQuery(query, params);
  },
};
