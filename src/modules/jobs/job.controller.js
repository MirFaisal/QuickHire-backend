const Job = require("./job.model");
require("../categories/category.model"); // register Category model for populate

const getAllJobs = async (_req, res, next) => {
  try {
    const jobs = await Job.find().populate("category", "name").sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: jobs.length, data: jobs });
  } catch (error) {
    next(error);
  }
};

const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate("category", "name");

    if (!job) {
      const error = new Error("Job not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
};

const createJob = async (req, res, next) => {
  try {
    const created = await Job.create(req.body);
    const job = await Job.findById(created._id).populate("category", "name");
    res.status(201).json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
};

const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);

    if (!job) {
      const error = new Error("Job not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ success: true, message: "Job deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllJobs, getJobById, createJob, deleteJob };
