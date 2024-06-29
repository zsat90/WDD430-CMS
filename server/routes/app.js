const express = require("express");
const path = require("path");
const router = express.Router();

// Define routes here
router.get("/", (req, res) => {
  res.render("index", { title: "CMS" });
});

module.exports = router;
