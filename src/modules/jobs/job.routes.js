const { Router } = require("express");
const {
  getAllJobs,
  getJobById,
  getDeletedJobs,
  createJob,
  deleteJob,
  restoreJob,
} = require("./job.controller");
const { jobSchema, validate } = require("./job.validation");
const requireAuth = require("../../middleware/requireAuth");

const router = Router();

router.get("/deleted", requireAuth, getDeletedJobs);
router.get("/", getAllJobs);
router.get("/:id", getJobById);
router.post("/", requireAuth, validate(jobSchema), createJob);
router.delete("/:id", requireAuth, deleteJob);
router.patch("/restore/:id", requireAuth, restoreJob);

module.exports = router;
