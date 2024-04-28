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
      throw HttpError(404);
    }
    res.status(200).json(result);
  } catch (error) {
    next(HttpError(error.status));
  }
};

export const createContact = async (req, res, next) => {
  try {
    const contact = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    };

    const { error, value } = createContactSchema.validate(contact);
    if (typeof error !== "undefined") {
      return res.status(400).send({ message: "Validation error" });
    }
    const newContact = await addContact(value.name, value.email, value.phone);
    res.status(201).json(newContact);
  } catch (error) {
    console.log(error.status);
    next(HttpError(error.status, "Internal Server Error"));
  }
};
export const updateContact = async (req, res, next) => {
  try {
    console.log(req.body.name);
    if (
      (req.body.name === undefined) &
      (req.body.phone === undefined) &
      (req.body.email === undefined)
    ) {
      throw HttpError(400, "Body must have at least one field");
    }
    const { error } = updateContactSchema.validate(req.body);
    if (error) {
      throw HttpError(400, "Validation error");
    }
    const { id } = req.params;
    const upContact = await updatedContact(id, req.body);
    console.log(updatedContact);
    if (!upContact) {
      throw HttpError(404, "Not found");
    }
    console.log(upContact);
    res.status(200).json(upContact);
  } catch (error) {
    next(HttpError(error.status, error.message));
  }
};
