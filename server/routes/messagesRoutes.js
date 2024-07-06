const express = require("express");
const router = express.Router();

const sequenceGenerator = require("./sequenceGenerator");
const Message = require("../models/messages");

router.get("/", async (req, res, next) => {
  try {
    const messages = await Message.find();
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving messages", error: err });
  }
});

router.post("/", async (req, res, next) => {
  try {
    const maxMessageId = sequenceGenerator.nextId("messages");

    const message = new Message({
      id: maxMessageId,
      subject: req.body.subject,
      msgText: req.body.msgText,
      sender: req.body.sender || null,
    });

    const createdMessage = await message.save();

    res.status(201).json({
      message: "Message added successfully",
      message: createdMessage,
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
    const updatedMessage = await Message.findOneAndUpdate(
      { id: req.params.id },
      {
        subject: req.body.subject,
        msgText: req.body.msgText,
        sender: req.body.sender || null,
      },
      { new: true, runValidators: true }
    );

    if (!updatedMessage) {
      return res.status(404).json({
        message: "Message not found.",
      });
    }

    res.status(200).json({
      message: "Message updated successfully",
      message: updatedMessage,
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
    const result = await Message.deleteOne({ id: req.params.id });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        message: "Message not found.",
      });
    }

    res.status(200).json({
      message: "Message deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred",
      error: error,
    });
  }
});

module.exports = router;
