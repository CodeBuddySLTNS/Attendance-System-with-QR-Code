import status from "http-status";
import { Attendance } from "../database/models/attendance.js";
import { CustomError } from "../lib/utils.js";

const attendances = async (req, res) => {
  const { date } = req.query;
  const result = await Attendance.getByDate(date);
  res.send(result);
};

const addAttendance = async (req, res) => {
  const { userId, type, date } = req.body;

  if (!userId || !type || !date)
    throw new CustomError("Missing required fields", status.BAD_REQUEST);

  const result = await Attendance.add(userId, type, date);
  res.send(result);
};

export default {
  attendances,
  addAttendance,
};
