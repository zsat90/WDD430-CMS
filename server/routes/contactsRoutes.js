const express = require("express");
const router = express.Router();

const sequenceGenerator = require("./sequenceGenerator");
const Contact = require("../models/contacts");

router.get("/", async (req, res, next) => {
  try {
    const contacts = await Contact.find().populate("group");
    res.status(200).json(contacts);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving contacts", error: err });
  }
});

router.post("/", async (req, res, next) => {
  try {
    const maxContactId = sequenceGenerator.nextId("contacts");

    const contact = new Contact({
      id: maxContactId,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      imageUrl: req.body.imageUrl,
      group: req.body.group || [],
    });

    const createdContact = await contact.save();

    res.status(201).json({
      message: "Contact added successfully",
      contact: createdContact,
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred",
      error: error,
    });
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const updatedContact = await Contact.findOneAndUpdate(
      { id: req.params.id },
      {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        imageUrl: req.body.imageUrl,
        group: req.body.group || [],
      },
      { new: true, runValidators: true }
    );

    if (!updatedContact) {
      return res.status(404).json({
        message: "Contact not found.",
      });
    }

    res.status(200).json({
      message: "Contact updated successfully",
      contact: updatedContact,
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred",
      error: error,
    });
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const result = await Contact.deleteOne({ id: req.params.id });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        message: "Contact not found.",
      });
    }

    res.status(200).json({
      message: "Contact deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred",
      error: error,
    });
  }
});

module.exports = router;
