import status from "http-status";
import { Attendance } from "../database/models/attendance.js";
import { CustomError } from "../lib/utils.js";

const attendances = async (req, res) => {
  const { date } = req.query || {};
  const result = await Attendance.getByDate(date);
  res.send(result);
};

const addAttendance = async (req, res) => {
  const { userId, type, dateTime, date } = req.body || {};

  if (!userId || !type || !dateTime || !date)
    throw new CustomError("Missing required fields", status.BAD_REQUEST);

  const result = await Attendance.add(userId, type, dateTime, date);
  res.send(result);
};

const deleteAttendance = async (req, res) => {
  const { id } = req.query || {};

  if (!id) throw new CustomError("Missing required fields", status.BAD_REQUEST);

  const result = await Attendance.deleteById(id);
  res.send(result);
};

const addClassAttendance = async (req, res) => {
  const { classId, userId, type, dateTime, date } = req.body || {};

  if (!classId || !userId || !type || !dateTime || !date)
    throw new CustomError("Missing required fields", status.BAD_REQUEST);

  const result = await Attendance.addClassAttendance(
    classId,
    userId,
    type,
    dateTime,
    date
  );
  res.send(result);
};

export default {
  attendances,
  addAttendance,
  deleteAttendance,
  addClassAttendance,
};
