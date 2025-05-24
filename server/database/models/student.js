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

  update: async (student) => {
    const query = `
      UPDATE users SET studentId = ?, name = ?, departmentId = ?, year = ? WHERE userId = ?`;
    const params = [
      student.studentId,
      student.name,
      student.departmentId,
      student.year,
      student.userId,
    ];
    return await sqlQuery(query, params);
  },

  delete: async (userId) => {
    const query = `DELETE FROM users WHERE userId = ?`;
    return await sqlQuery(query, [userId]);
  },

  getStudentsByDepartment: async (date, departmentId, year) => {
    const query = `
      SELECT 
        u.userId,
        u.name,
        u.studentId,
        d.departmentName,
        u.year,
        a.attendanceId,
        a.type,
        a.dateTime,
        a.date
      FROM users u
      JOIN departments d ON u.departmentId = d.departmentId
      LEFT JOIN attendances a 
        ON u.userId = a.userId AND a.date = ?
      WHERE 
        u.departmentId = ?
        AND u.year = ?
        AND u.role = 'student'`;

    const result = await sqlQuery(query, [date, departmentId, year]);

    const students = result.map((row) => {
      return {
        userId: row.userId,
        name: row.name,
        studentId: row.studentId,
        isPresent: row.attendanceId !== null,
        ...(row.attendanceId && {
          attendance: {
            attendanceId: row.attendanceId,
            type: row.type,
            dateTime: row.dateTime,
            date: row.date,
          },
        }),
      };
    });

    const totalStudents = students.length;
    const presentCount = students.filter((s) => s.isPresent).length;
    const absentCount = totalStudents - presentCount;

    return {
      departmentName: result[0]?.departmentName || "",
      year: result[0]?.year || null,
      totalStudents,
      presentCount,
      absentCount,
      students,
    };
  },
};
