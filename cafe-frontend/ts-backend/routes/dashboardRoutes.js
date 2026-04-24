const express = require("express");
const { authenticateUser, requireAdmin } = require("../middleware/auth");
const { asyncHandler } = require("../utils/asyncHandler");
const { buildDashboardSummary } = require("../services/dashboardService");

const router = express.Router();

router.use(authenticateUser, requireAdmin);

router.get(
  "/summary",
  asyncHandler(async (req, res) => {
    const summary = await buildDashboardSummary();
    res.json(summary);
  })
);

module.exports = router;
