import { Router } from "express";
import handler from "../handlers/auth.js";
import { tryCatch } from "../lib/utils.js";

const router = Router();

router.post("/", tryCatch(handler.login));
router.get("/session", tryCatch(handler.session));

export default router;
