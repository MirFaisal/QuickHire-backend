const Application = require("./application.model");
const Job = require("../jobs/job.model");

const submitApplication = async (req, res, next) => {
  try {
    const { job_id } = req.body;

    const jobExists = await Job.findById(job_id);
    if (!jobExists) {
      const error = new Error("Job not found — cannot apply to a non-existent job");
      error.statusCode = 404;
      throw error;
    }

    const application = await Application.create(req.body);
    res.status(201).json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
};

module.exports = { submitApplication };
