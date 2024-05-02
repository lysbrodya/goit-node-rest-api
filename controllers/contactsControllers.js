import HttpError from "../helpers/HttpError.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";
import contactsService from "../services/contactsServices.js";

const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updatedContact,
} = contactsService;

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.status(200).json(contacts);
  } catch (error) {
    next(HttpError(error.status, "Internal Server Error"));
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await getContactById(id);

    if (!result) throw HttpError(404);
    res.status(200).json(result);
  } catch (error) {
    next(HttpError(error.status));
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await removeContact(id);

    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.status(200).json(result);
  } catch (error) {
    next(HttpError(error.status));
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { error, value } = createContactSchema.validate(req.body);
    if (typeof error !== "undefined") {
      throw HttpError(400, error.message);
    }
    const newContact = await addContact(req.body);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};
export const updateContact = async (req, res, next) => {
  try {
    const { error } = updateContactSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const { id } = req.params;
    const upContact = await updatedContact(id, req.body);
    if (!upContact) {
      throw HttpError(404, "Not found");
    }
    console.log(upContact);
    res.status(200).json(upContact);
  } catch (error) {
    next(error);
  }
};
