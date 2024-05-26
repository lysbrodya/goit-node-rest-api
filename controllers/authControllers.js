import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";

import User from "../models/user.js";
import { userContactSchema } from "../schemas/contactsSchemas.js";
import HttpError from "../helpers/HttpError.js";

async function register(req, res, next) {
  const { name, email, password } = req.body;

  try {
    const { error } = userContactSchema.validate(req.body);
    if (typeof error !== "undefined") {
      throw HttpError(400, error.message);
    }
    const emailToLowerCase = email.toLowerCase();
    const myuser = await User.findOne({ email: emailToLowerCase });
    if (myuser !== null) {
      return res.status(409).json({ message: "Email in use" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email: emailToLowerCase,
      password: passwordHash,
    });
    res.status(201).send({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  const { email, password } = req.body;

  try {
    const { error } = userContactSchema.validate(req.body);
    if (typeof error !== "undefined") {
      throw HttpError(400, error.message);
    }
    const emailToLowerCase = email.toLowerCase();
    const user = await User.findOne({ email: emailToLowerCase });
    if (user === null) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }
    const isMutch = await bcrypt.compare(password, user.password);

    if (isMutch === false) {
      return res.status(401).send({ message: "Email or password is wrong" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    await User.findByIdAndUpdate(user._id, { token });

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
  try {
    await User.findByIdAndUpdate(req.user.id, { token: null });
    return res.status(204).end();
  } catch (error) {
    next(error);
  }
}
async function current(req, res, next) {
  try {
    await User.findOne(req.user);
    return res
      .status(200)
      .json({ email: req.user.email, subscription: req.user.subscription });
  } catch (error) {
    next(error);
  }
}
export default { register, login, logout, current };
