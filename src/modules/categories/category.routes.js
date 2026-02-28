const { Router } = require("express");
const {
  createCategory,
  getAllCategories,
  getDeletedCategories,
  deleteCategory,
  restoreCategory,
} = require("./category.controller");
const { categorySchema } = require("./category.validation");
const { validate } = require("../jobs/job.validation");
const requireAuth = require("../../middleware/requireAuth");

const router = Router();

router.get("/deleted", requireAuth, getDeletedCategories);
router.post("/", requireAuth, validate(categorySchema), createCategory);
router.get("/", getAllCategories);
router.delete("/:id", requireAuth, deleteCategory);
router.patch("/restore/:id", requireAuth, restoreCategory);

module.exports = router;
