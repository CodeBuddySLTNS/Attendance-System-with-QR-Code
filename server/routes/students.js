import { Router } from "express";
import handler from "../handlers/students.js";

const router = Router();

router.get("/", handler.students);
router.post("/add", handler.addStudent);

export default router;
