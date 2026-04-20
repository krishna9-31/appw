const express = require("express");
const { getBuses, getBusById } = require("../controllers/busController");

const router = express.Router();

router.get("/", getBuses);
router.get("/:busId", getBusById);

module.exports = router;
