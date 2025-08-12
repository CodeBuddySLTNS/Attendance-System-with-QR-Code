import { Router } from "express";
import handler from "../handlers/classes.js";
import { tryCatch } from "../lib/utils.js";

const router = Router();

router.get("/", tryCatch(handler.classes));
router.post("/add", tryCatch(handler.addClass));

export default router;
