const mongoose = require("mongoose");
const Sequence = require("../models/sequence"); // Ensure this path is correct

class SequenceGenerator {
  constructor() {
    this.sequenceId = null;
    this.maxDocumentId = 100; // Default value, update as needed
    this.maxMessageId = 100; // Default value, update as needed
    this.maxContactId = 100; // Default value, update as needed

    this.initialize();
  }

  async initialize() {
    try {
      const sequence = await Sequence.findOne();
      if (sequence) {
        this.sequenceId = sequence._id;
        this.maxDocumentId = sequence.maxDocumentId || 100;
        this.maxMessageId = sequence.maxMessageId || 100;
        this.maxContactId = sequence.maxContactId || 100;
      } else {
        // Create a new sequence document if none exists
        const newSequence = new Sequence({
          maxDocumentId: this.maxDocumentId,
          maxMessageId: this.maxMessageId,
          maxContactId: this.maxContactId,
        });
        await newSequence.save();
        this.sequenceId = newSequence._id;
      }
    } catch (err) {
      console.error("Error initializing SequenceGenerator:", err);
    }
  }

  nextId(collectionType) {
    let nextId;
    switch (collectionType) {
      case "documents":
        this.maxDocumentId++;
        nextId = this.maxDocumentId;
        break;
      case "messages":
        this.maxMessageId++;
        nextId = this.maxMessageId;
        break;
      case "contacts":
        this.maxContactId++;
        nextId = this.maxContactId;
        break;
      default:
        throw new Error("Invalid collection type");
    }

    this.updateSequence(collectionType);
    return nextId;
  }

  async updateSequence(collectionType) {
    const updateObject = {};
    switch (collectionType) {
      case "documents":
        updateObject.maxDocumentId = this.maxDocumentId;
        break;
      case "messages":
        updateObject.maxMessageId = this.maxMessageId;
        break;
      case "contacts":
        updateObject.maxContactId = this.maxContactId;
        break;
    }

    try {
      await Sequence.updateOne(
        { _id: this.sequenceId },
        { $set: updateObject }
      );
    } catch (err) {
      console.error("Error updating sequence:", err);
    }
  }
}

module.exports = new SequenceGenerator();
