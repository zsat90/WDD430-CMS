const mongoose = require("mongoose");

const sequenceSchema = mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 100 },
});

const Sequence = mongoose.model("Sequence", sequenceSchema);

module.exports = Sequence;
