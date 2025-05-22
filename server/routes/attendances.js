import { Router } from "express";
import handler from "../handlers/attendances.js";

const router = Router();

router.get("/", handler.attendances);
router.post("/add", handler.addAttendance);

export default router;
