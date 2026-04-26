const express = require("express");
const { authenticateUser, requireAdmin } = require("../middleware/auth");
const { asyncHandler } = require("../utils/asyncHandler");
const { createContactMessage, getContactMessages } = require("../services/contactMessageService");

const router = express.Router();

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const message = await createContactMessage(req.body || {});
    res.status(201).json({
      message: "Message received",
      contactMessage: message,
    });
  })
);

router.get(
  "/messages",
  authenticateUser,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const messages = await getContactMessages();
    res.json({ messages });
  })
);

module.exports = router;
