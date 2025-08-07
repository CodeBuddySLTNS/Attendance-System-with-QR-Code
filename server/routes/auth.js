import { Router } from "express";
import handler from "../handlers/auth.js";
import { tryCatch } from "../lib/utils.js";

const router = Router();

router.post("/login", tryCatch(handler.login));
router.post("/signup", tryCatch(handler.signup));
router.get("/session", tryCatch(handler.session));

export default router;
