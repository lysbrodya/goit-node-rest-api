import express from "express";

import authMw from "../middlewars/authMw.js";

import authRoutes from "./authRoutes.js";
import contactsRoutes from "./contactsRouter.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/contacts", authMw, contactsRoutes);

export default router;
