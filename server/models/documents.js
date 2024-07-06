const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: false,
  },
  children: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
    },
  ],
});

module.exports = mongoose.model("Document", documentSchema);
