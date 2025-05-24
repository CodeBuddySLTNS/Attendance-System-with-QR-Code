import status from "http-status";
import { Student } from "../database/models/student.js";
import { CustomError } from "../lib/utils.js";

const students = async (req, res) => {
  const result = await Student.getAll();
  res.send(result);
};

const studentsByDepartment = async (req, res) => {
  const { date, departmentId, year } = req.query || {};
  console.log(req.query);
  if (!date || !departmentId || !year) {
    throw new CustomError("All fields are required", status.BAD_REQUEST);
  }

  const result = await Student.getStudentsByDepartment(
    date,
    departmentId,
    year
  );
  res.send(result);
};

const addStudent = async (req, res) => {
  const { studentId, name, departmentId, year } = req.body || {};

  if (!studentId || !name || !departmentId || !year) {
    throw new CustomError("All fields are required", status.BAD_REQUEST);
  }

  const result = await Student.add(req.body);
  res.status(status.CREATED).send(result);
};

const editStudent = async (req, res) => {
  const { studentId, name, departmentId, year } = req.body || {};

  if (!studentId || !name || !departmentId || !year) {
    throw new CustomError("All fields are required", status.BAD_REQUEST);
  }

  const result = await Student.update(req.body);
  res.status(status.CREATED).send(result);
};

const deleteStudent = async (req, res) => {
  const { userId } = req.body || {};
  const result = await Student.delete(userId);
  res.send(result);
};

export default {
  students,
  addStudent,
  editStudent,
  deleteStudent,
  studentsByDepartment,
};
