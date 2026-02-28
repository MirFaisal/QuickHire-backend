const { Router } = require("express");
const { createCategory, getAllCategories, deleteCategory } = require("./category.controller");
const { categorySchema } = require("./category.validation");
const { validate } = require("../jobs/job.validation");
const requireAuth = require("../../middleware/requireAuth");

const router = Router();

router.post("/", requireAuth, validate(categorySchema), createCategory);
router.get("/", getAllCategories);
router.delete("/:id", requireAuth, deleteCategory);

module.exports = router;
