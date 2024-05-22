import express from "express";

import AuthController from "../controllers/authControllers.js";

import authMw from "../middlewars/authMw.js";

const router = express.Router();
const jsonParser = express.json();

router.post("/register", jsonParser, AuthController.register);
router.post("/login", jsonParser, AuthController.login);
router.get("/logout", authMw, AuthController.logout);
router.get("/current", authMw, AuthController.current);

export default router;
