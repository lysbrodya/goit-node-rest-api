import Contact from "../models/contact.js";
import HttpError from "../helpers/HttpError.js";
import {
  createContactSchema,
  updateContactSchema,
  updateStatusContactSchema,
} from "../schemas/contactsSchemas.js";

async function getAllContacts(req, res, next) {
  try {
    const contacts = await Contact.find();
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
}

async function getOneContact(req, res, next) {
  const { id } = req.params;
  try {
    const contact = await Contact.findById(id);
    if (contact === null) {
      throw HttpError(404, "Not found");
    }
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
}

async function createContact(req, res, next) {
  const { name, email, phone, favourite } = req.body;
  const contact = { name, email, phone, favourite };

  try {
    const { error } = createContactSchema.validate(req.body);
    if (typeof error !== "undefined") {
      throw HttpError(400, error.message);
    }
    const newContact = await Contact.create(contact);
    res.status(201).send(newContact);
  } catch (error) {
    next(error);
  }
}

async function updateContact(req, res, next) {
  const { id } = req.params;
  const { name, email, phone, favorite } = req.body;
  const contact = { name, email, phone, favorite };
  try {
    if (Object.keys(req.body).length === 0) {
      throw HttpError(400, "Body must have at least one field");
    }
    const { error } = updateContactSchema.validate(req.body);
    if (typeof error !== "undefined") {
      throw HttpError(400, error.message);
    }
    const updatedContact = await Contact.findByIdAndUpdate(id, contact, {
      new: true,
    });
    if (updatedContact === null) {
      throw HttpError(404, "Not found");
    }
    res.send(updatedContact);
  } catch (error) {
    next(error);
  }
}

async function deleteContact(req, res, next) {
  const { id } = req.params;
  try {
    const deletedContact = await Contact.findByIdAndDelete(id);
    if (deletedContact === null) {
      throw HttpError(404, "Not found");
    }
    res.send(deletedContact);
  } catch (error) {
    next(error);
  }
}

async function updateStatusContact(req, res, next) {
  const { id } = req.params;
  const { favorite } = req.body;
  const contact = { favorite };
  try {
    const { error } = updateStatusContactSchema.validate(req.body);
    if (typeof error !== "undefined") {
      throw HttpError(400, error.message);
    }
    const updatedContact = await Contact.findByIdAndUpdate(id, contact, {
      new: true,
    });
    if (updatedContact === null) {
      throw HttpError(404, "Not found");
    }
    res.send(updatedContact);
  } catch (error) {
    next(error);
  }
}

export default {
  getAllContacts,
  getOneContact,
  createContact,
  updateContact,
  deleteContact,
  updateStatusContact,
};
