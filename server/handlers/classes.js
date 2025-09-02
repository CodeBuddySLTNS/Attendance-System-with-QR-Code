import status from "http-status";
import { CustomError } from "../lib/utils.js";
import { Class } from "../database/models/class.js";

const classes = async (req, res) => {
  const result = await Class.getByTeacherId(res.locals.userId);
  res.send(result);
};

const addClass = async (req, res) => {
  const { className, departmentId, year, time } = req.body;

  if (!className || !departmentId || !year || !time) {
    throw new CustomError(
      status.BAD_REQUEST,
      "All fields are required: className, departmentId, year, time"
    );
  }

  const result = await Class.add({ ...req.body, teacherId: res.locals.userId });
  res.status(status.CREATED).send(result);
};

const getClassById = async (req, res) => {
  const { classId } = req.params;
  if (!classId) {
    throw new CustomError(status.BAD_REQUEST, "classId is required");
  }

  const result = await Class.getById(parseInt(classId), res.locals.userId);
  if (!result) {
    throw new CustomError(status.NOT_FOUND, "Class not found");
  }

  res.send(result);
};

const getClassStudents = async (req, res) => {
  const { classId } = req.params;
  if (!classId)
    throw new CustomError(status.BAD_REQUEST, "classId is required");

  // Ensure the class belongs to this teacher
  const cls = await Class.getById(parseInt(classId), res.locals.userId);
  if (!cls) throw new CustomError(status.NOT_FOUND, "Class not found");

  const students = await Class.getStudents(parseInt(classId));
  res.send(students);
};

const addClassStudent = async (req, res) => {
  const { classId } = req.params;
  const { userId } = req.body || {};
  if (!classId || !userId)
    throw new CustomError(
      status.BAD_REQUEST,
      "classId and userId are required"
    );

  const cls = await Class.getById(parseInt(classId), res.locals.userId);
  if (!cls) throw new CustomError(status.NOT_FOUND, "Class not found");

  await Class.addStudent(parseInt(classId), parseInt(userId));
  res.status(status.CREATED).send({ message: "Student added to class" });
};

const removeClassStudent = async (req, res) => {
  const { classId, userId } = req.params;
  if (!classId || !userId)
    throw new CustomError(
      status.BAD_REQUEST,
      "classId and userId are required"
    );

  const cls = await Class.getById(parseInt(classId), res.locals.userId);
  if (!cls) throw new CustomError(status.NOT_FOUND, "Class not found");

  await Class.removeStudent(parseInt(classId), parseInt(userId));
  res.send({ message: "Student removed from class" });
};

const validateStudentInClass = async (req, res) => {
  const { classId, userId } = req.params;
  if (!classId || !userId)
    throw new CustomError(
      status.BAD_REQUEST,
      "classId and userId are required"
    );

  const cls = await Class.getById(parseInt(classId), res.locals.userId);
  if (!cls) throw new CustomError(status.NOT_FOUND, "Class not found");

  const student = await Class.getStudentInClass(
    parseInt(classId),
    parseInt(userId)
  );

  if (!student)
    throw new CustomError(status.NOT_FOUND, "Student not in this class");

  res.send(student);
};

const attendanceByDate = async (req, res) => {
  const { classId } = req.params;
  const { date } = req.query;
  if (!classId)
    throw new CustomError(status.BAD_REQUEST, "classId is required");
  if (!date)
    throw new CustomError(status.BAD_REQUEST, "date is required (YYYY-MM-DD)");

  const cls = await Class.getById(parseInt(classId), res.locals.userId);
  if (!cls) throw new CustomError(status.NOT_FOUND, "Class not found");

  const list = await Class.getAttendanceByDate(parseInt(classId), date);
  res.send(list);
};

const attendanceAll = async (req, res) => {
  const { classId } = req.params;
  if (!classId)
    throw new CustomError(status.BAD_REQUEST, "classId is required");

  const cls = await Class.getById(parseInt(classId), res.locals.userId);
  if (!cls) throw new CustomError(status.NOT_FOUND, "Class not found");

  const list = await Class.getAttendanceAll(parseInt(classId));
  res.send(list);
};

const attendanceMatrix = async (req, res) => {
  const { classId } = req.params;
  if (!classId)
    throw new CustomError(status.BAD_REQUEST, "classId is required");

  const cls = await Class.getById(parseInt(classId), res.locals.userId);
  if (!cls) throw new CustomError(status.NOT_FOUND, "Class not found");

  const list = await Class.getAttendanceMatrix(parseInt(classId));
  res.send(list);
};

export default {
  classes,
  addClass,
  getClassById,
  getClassStudents,
  addClassStudent,
  removeClassStudent,
  validateStudentInClass,
  attendanceByDate,
  attendanceAll,
  attendanceMatrix,
};
