const { z } = require("zod");

const applicationSchema = z.object({
  job_id: z.string({ required_error: "Job ID is required" }).min(1, "Job ID cannot be empty"),
  name: z.string({ required_error: "Name is required" }).min(1, "Name cannot be empty"),
  email: z.string({ required_error: "Email is required" }).email("Must be a valid email address"),
  resume_link: z.string({ required_error: "Resume link is required" }).url("Must be a valid URL"),
  cover_note: z.string({ required_error: "Cover note is required" }).min(1, "Cover note cannot be empty"),
});

module.exports = { applicationSchema };
