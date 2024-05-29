import express from "express";

import AuthController from "../controllers/authControllers.js";

import authMw from "../middlewars/authMw.js";

import aploadMiddleware from "../middlewars/apload.js";

const router = express.Router();
const jsonParser = express.json();

router.post("/register", jsonParser, AuthController.register);
router.post("/login", jsonParser, AuthController.login);
router.post("/logout", authMw, AuthController.logout);
router.get("/current", authMw, AuthController.current);
// router.get("/avatar", AuthController.getAvatar);
router.patch(
  "/avatars",
  authMw,
  aploadMiddleware.single("avatar"),
  AuthController.aploadAvatar
);

export default router;
