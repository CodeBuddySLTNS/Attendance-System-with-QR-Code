import { Router } from "express";
import handler from "../handlers/classes.js";
import { tryCatch } from "../lib/utils.js";

const router = Router();

router.get("/", tryCatch(handler.classes));
router.get("/:classId", tryCatch(handler.getClassById));
router.get("/:classId/students", tryCatch(handler.getClassStudents));
router.post("/:classId/students", tryCatch(handler.addClassStudent));
router.delete(
  "/:classId/students/:userId",
  tryCatch(handler.removeClassStudent)
);
router.get(
  "/:classId/students/:userId/validate",
  tryCatch(handler.validateStudentInClass)
);
router.get("/:classId/attendance", tryCatch(handler.attendanceByDate));
router.get("/:classId/attendance/all", tryCatch(handler.attendanceAll));
router.get("/:classId/attendance/matrix", tryCatch(handler.attendanceMatrix));
router.post("/add", tryCatch(handler.addClass));

export default router;
