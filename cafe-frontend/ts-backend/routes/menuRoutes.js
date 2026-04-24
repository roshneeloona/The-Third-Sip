const express = require("express");
const { authenticateUser, requireAdmin } = require("../middleware/auth");
const { asyncHandler } = require("../utils/asyncHandler");
const { getMenuItems, getMenuItemById, updateMenuItem } = require("../services/menuCatalog");
const { HttpError } = require("../utils/httpError");
const { emitAdmin } = require("../services/socketService");

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const includeInactive = req.query.includeInactive === "true";
    const items = await getMenuItems({
      includeInactive,
      category: req.query.category,
      limit: req.query.limit,
    });

    res.json({ items });
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const item = await getMenuItemById(req.params.id, { includeInactive: true });
    if (!item) {
      throw new HttpError(404, "Menu item not found");
    }
    res.json({ item });
  })
);

router.patch(
  "/:id",
  authenticateUser,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const updatedItem = await updateMenuItem(req.params.id, req.body || {});
    emitAdmin("menu:updated", { item: updatedItem });
    res.json({
      message: "Menu item updated",
      item: updatedItem,
    });
  })
);

module.exports = router;
