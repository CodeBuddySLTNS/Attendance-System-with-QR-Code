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
  getById: async (classId, teacherId) => {
    const results = await sqlQuery(
      `SELECT c.*, d.acronym AS department FROM classes c
      INNER JOIN departments d ON c.departmentId = d.departmentId
      WHERE c.classId = ? AND c.teacherId = ?
      LIMIT 1`,
      [classId, teacherId]
    );
    return results[0] ?? null;
  },
  getStudents: async (classId) => {
    return await sqlQuery(
      `SELECT u.userId, u.studentId, u.name, u.photo, d.acronym AS departmentAcronym, u.year
      FROM class_students cs
      JOIN users u ON cs.userId = u.userId
      JOIN departments d ON u.departmentId = d.departmentId
      WHERE cs.classId = ?
      ORDER BY u.name ASC`,
      [classId]
    );
  },
  getStudentInClass: async (classId, userId) => {
    const results = await sqlQuery(
      `SELECT u.userId, u.studentId, u.name, u.photo, d.acronym AS departmentAcronym, u.year
      FROM class_students cs
      JOIN users u ON cs.userId = u.userId
      JOIN departments d ON u.departmentId = d.departmentId
      WHERE cs.classId = ? AND cs.userId = ?
      LIMIT 1`,
      [classId, userId]
    );
    return results[0] ?? null;
  },
  addStudent: async (classId, userId) => {
    return await sqlQuery(
      `INSERT IGNORE INTO class_students(classId, userId) VALUES (?, ?)`,
      [classId, userId]
    );
  },
  removeStudent: async (classId, userId) => {
    return await sqlQuery(
      `DELETE FROM class_students WHERE classId = ? AND userId = ?`,
      [classId, userId]
    );
  },
  getAttendanceByDate: async (classId, date) => {
    // Return all students in class with present flag and time for given date
    return await sqlQuery(
      `SELECT 
        u.userId,
        u.name,
        u.photo,
        d.acronym AS departmentAcronym,
        u.year,
        a.dateTime,
        CASE WHEN a.userId IS NOT NULL THEN 1 ELSE 0 END AS present
      FROM class_students cs
      JOIN users u ON cs.userId = u.userId
      JOIN departments d ON u.departmentId = d.departmentId
      LEFT JOIN attendances a 
        ON a.classId = cs.classId 
        AND a.userId = cs.userId 
        AND a.date = ?
      WHERE cs.classId = ?
      ORDER BY u.name ASC`,
      [date, classId]
    );
  },
  getAttendanceAll: async (classId) => {
    // Return all attendance records for the class
    return await sqlQuery(
      `SELECT 
        a.userId,
        u.name,
        u.photo,
        d.acronym AS departmentAcronym,
        u.year,
        a.date,
        a.dateTime
      FROM attendances a
      JOIN users u ON a.userId = u.userId
      JOIN departments d ON u.departmentId = d.departmentId
      WHERE a.classId = ?
      ORDER BY a.dateTime DESC`,
      [classId]
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
