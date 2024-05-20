import Contact from "../models/contact.js";
import HttpError from "../helpers/HttpError.js";
import {
  createContactSchema,
  updateContactSchema,
  updateStatusContactSchema,
} from "../schemas/contactsSchemas.js";

async function getAllContacts(req, res, next) {
  console.log({ user: req.user });
  try {
    const contacts = await Contact.find({ owner: req.user.id });
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
}

async function getOneContact(req, res, next) {
  const { id } = req.params;
  try {
    //Добавить джой проверку на обджект айди
    const contact = await Contact.findById(id);
    if (contact === null) {
      return res.status(404).send("Contact not found");
    }

    if (contact.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your contact, ALARMA" });
    }
    //////////////

    // const contact = await Contact.findOne({ _id: id, owner: req.user.id });
    // console.log(contact.owner.toString(), req.user.id);
    // if (contact === null) {
    //   return res.status(404).json({ message: "Not your contact, ALARMA" });
    // }
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
}

async function createContact(req, res, next) {
  const { name, email, phone, favourite } = req.body;
  const contact = { name, email, phone, favourite, owner: req.user.id };

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
    if (updatedContact.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your contact, ALARMA" });
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
    if (deletedContact.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your contact, ALARMA" });
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
    if (updatedContact.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your contact, ALARMA" });
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
