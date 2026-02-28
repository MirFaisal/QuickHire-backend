const { Router } = require("express");
const {
  getAllApplications,
  submitApplication,
  deleteApplication,
  restoreApplication,
} = require("./application.controller");
const { applicationSchema } = require("./application.validation");
const { validate } = require("../jobs/job.validation");
const requireAuth = require("../../middleware/requireAuth");

const router = Router();

router.get("/", requireAuth, getAllApplications);
router.post("/", validate(applicationSchema), submitApplication);
router.delete("/:id", requireAuth, deleteApplication);
router.patch("/restore/:id", requireAuth, restoreApplication);

module.exports = router;
