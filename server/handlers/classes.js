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

export default {
  classes,
  addClass,
};
