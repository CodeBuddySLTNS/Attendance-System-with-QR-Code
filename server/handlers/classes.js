import status from "http-status";
import { Student } from "../database/models/student.js";
import { CustomError } from "../lib/utils.js";

const classes = async (req, res) => {
  const result = await Student.getAll();
  res.send(result);
};

export default {
  classes,
};
