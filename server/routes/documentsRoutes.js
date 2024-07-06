const express = require("express");
const router = express.Router();

const Document = require("../models/documents");
const sequenceGenerator = require("./sequenceGenerator");

router.get("/", async (req, res, next) => {
  try {
    const documents = await Document.find();
    res.status(200).json(documents);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving documents", error: err });
  }
});

router.post("/", async (req, res, next) => {
  try {
    const maxDocumentId = await sequenceGenerator.nextId("documents");

    const document = new Document({
      id: maxDocumentId.toString(),
      name: req.body.name,
      url: req.body.url,
      children: req.body.children || [],
    });

    const createdDocument = await document.save();

    res.status(201).json({
      message: "Document added successfully",
      document: createdDocument,
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred",
      error: error.message,
    });
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const document = await Document.findOne({ id: req.params.id });

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    document.name = req.body.name || document.name;
    document.url = req.body.url || document.url;

    if (Array.isArray(req.body.children)) {
      document.children = req.body.children;
    }

    await document.save();

    res
      .status(200)
      .json({ message: "Document updated successfully", document });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const document = await Document.findOne({ id: req.params.id });
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    await Document.deleteOne({ id: req.params.id });

    res.status(204).json({ message: "Document deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
});

module.exports = router;
