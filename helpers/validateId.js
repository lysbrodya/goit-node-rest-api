import HttpError from "../helpers/HttpError.js";
import { isValidObjectId } from "mongoose";

const isValidId = (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    next(HttpError(400, `${id} is not valid id`));
  }
  next();
};

export default isValidId;
