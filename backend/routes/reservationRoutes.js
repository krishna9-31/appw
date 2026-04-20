const express = require("express");
const {
  createReservation,
  updateReservation,
  deleteReservation,
} = require("../controllers/bookingController");

const router = express.Router();

router.post("/", createReservation);
router.patch("/:id", updateReservation);
router.delete("/:id", deleteReservation);

module.exports = router;
