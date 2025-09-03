import { Router } from "express";
import handler from "../handlers/students.js";
import { upload } from "../middlewares/upload.js";
import { tryCatch } from "../lib/utils.js";

const router = Router();

router.get("/", tryCatch(handler.students));
router.post("/add", tryCatch(handler.addStudent));
router.patch("/update", upload.single("photo"), tryCatch(handler.editStudent));
router.delete("/delete", tryCatch(handler.deleteStudent));
router.get("/bydepartment", tryCatch(handler.studentsByDepartment));

export default router;
