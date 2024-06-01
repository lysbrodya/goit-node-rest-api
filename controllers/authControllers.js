import bcrypt from "bcrypt";
import * as fs from "node:fs/promises";
import path from "node:path";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import Jimp from "jimp";
import { nanoid } from "nanoid";
import sendEmail from "../helpers/sendemail.js";

import User from "../models/user.js";
import { userContactSchema } from "../schemas/contactsSchemas.js";
import HttpError from "../helpers/HttpError.js";

const { BASE_URL } = process.env;

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
    const avatarURL = gravatar.url(email);
    const verificationToken = nanoid();
    const newUser = await User.create({
      name,
      email: emailToLowerCase,
      password: passwordHash,
      avatarURL,
      verificationToken,
    });

    const verifyMail = {
      to: email,
      subject: "Verify email",
      html: `<a style="color: red" target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Click verify email</a>`,
      text: `To confirm your email please open the link ${BASE_URL}/api/users/verify/${verificationToken}`,
    };

    await sendEmail(verifyMail);
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
async function verifyEmail(req, res, next) {
  console.log(req.params);
  try {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });
    if (!user) {
      throw HttpError(401, "User not found");
    }
    await User.findByIdAndUpdate(user._id, {
      verify: true,
      verificationToken: "",
    });
    res.status(200).json({ message: "Verification successful" });
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

    if (!user.verify) {
      throw HttpError(401, "Please verify your email");
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
async function aploadAvatar(req, res, next) {
  try {
    if (req.file === undefined) {
      return res.status(401).json({ message: "Not found file" });
    }

    const image = await Jimp.read(req.file.path);
    await image.resize(250, 250).writeAsync(req.file.path);
    await fs.rename(
      req.file.path,
      path.resolve("public/avatars", req.file.filename)
    );

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatarURL: `/avatars/${req.file.filename}` },
      { new: true }
    );
    if (user === null) {
      return res.status(404).json("not found");
    }
    res.json({ avatarURL: user.avatarURL });
  } catch (error) {
    console.error("Error:", error);
    next(error);
  }
}

export default { register, login, logout, current, aploadAvatar, verifyEmail };
