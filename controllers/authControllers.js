import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";

import User from "../models/user.js";
// import Joi from "joi";

async function register(req, res, next) {
  // Joi PEREVIRKA
  const { name, email, password } = req.body;
  const emailToLowerCase = email.toLowerCase();
  try {
    const myuser = await User.findOne({ email: emailToLowerCase });
    if (myuser !== null) {
      return res.status(409).json({ message: "User already register" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await User.create({
      name,
      email: emailToLowerCase,
      password: passwordHash,
    });
    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  // Joi PEREVIRKA
  const { email, password } = req.body;
  const emailToLowerCase = email.toLowerCase();
  try {
    const user = await User.findOne({ email: emailToLowerCase });
    if (user === null) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }
    const isMutch = await bcrypt.compare(password, user.password);

    if (isMutch === false) {
      return res.status(401).send({ message: "Email or password is wrong" });
    }

    const token = await jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.send({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function logout(req, res, next) {
  res.json("Logout");
}

export default { register, login, logout };
