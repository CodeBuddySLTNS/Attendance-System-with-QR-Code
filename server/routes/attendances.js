import { Router } from "express";
import handler from "../handlers/attendances.js";
import { tryCatch } from "../lib/utils.js";

const router = Router();

router.get("/", tryCatch(handler.attendances));
router.post("/add", tryCatch(handler.addAttendance));
router.delete("/delete", tryCatch(handler.deleteAttendance));

export default router;
