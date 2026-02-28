const Application = require("./application.model");
const Job = require("../jobs/job.model");

const getAllApplications = async (_req, res, next) => {
  try {
    const applications = await Application.find().populate("job_id", "title company").sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: applications.length, data: applications });
  } catch (error) {
    next(error);
  }
};

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

const deleteApplication = async (req, res, next) => {
  try {
    const application = await Application.softDeleteById(req.params.id);

    if (!application) {
      const error = new Error("Application not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ success: true, message: "Application deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const restoreApplication = async (req, res, next) => {
  try {
    const application = await Application.restore(req.params.id);

    if (!application) {
      const error = new Error("Application not found or not deleted");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
};
const getDeletedApplications = async (_req, res, next) => {
  try {
    const applications = await Application.findDeleted()
      .populate("job_id", "title company")
      .sort({ deletedAt: -1 });
    res.status(200).json({ success: true, count: applications.length, data: applications });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  getAllApplications,
  getDeletedApplications,
  submitApplication,
  deleteApplication,
  restoreApplication,
};
