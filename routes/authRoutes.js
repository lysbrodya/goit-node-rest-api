import express from "express";

const router = express.Router();
import authMw from "../middlewars/authMw.js";

import AuthController from "../controllers/authControllers.js";

const jsonParser = express.json();

router.post("/register", jsonParser, AuthController.register);
router.post("/login", jsonParser, AuthController.login);
router.get("/logout", authMw, AuthController.logout);

export default router;
