import { Department } from "../database/models/department.js";

export const departments = async (req, res) => {
  const result = await Department.getAll();
  res.send(result);
};

export default {
  departments,
};
