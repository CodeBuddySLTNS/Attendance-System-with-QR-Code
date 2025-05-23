import { Router } from "express";
import handler from "../handlers/students.js";
import { tryCatch } from "../lib/utils.js";

const router = Router();

router.get("/", tryCatch(handler.students));
router.post("/add", tryCatch(handler.addStudent));
router.patch("/update", tryCatch(handler.editStudent));
router.delete("/delete", tryCatch(handler.deleteStudent));

export default router;
