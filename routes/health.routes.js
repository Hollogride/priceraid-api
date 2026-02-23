const express = require("express");
const router = express.Router();
const { getHealth, getReadiness } = require("../controllers/health.controller");

router.get("/", getHealth);
router.get("/ready", getReadiness);

module.exports = router;
