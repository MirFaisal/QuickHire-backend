const { z } = require("zod");

const jobSchema = z.object({
  title: z.string({ required_error: "Title is required" }).min(1, "Title cannot be empty"),
  company: z.string({ required_error: "Company is required" }).min(1, "Company cannot be empty"),
  location: z.string({ required_error: "Location is required" }).min(1, "Location cannot be empty"),
  category: z.string({ required_error: "Category is required" }).min(1, "Category cannot be empty"),
  description: z.string({ required_error: "Description is required" }).min(1, "Description cannot be empty"),
});

const validate = (schema) => (req, _res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const error = new Error(result.error.errors.map((e) => e.message).join(", "));
    error.statusCode = 400;
    return next(error);
  }

  req.body = result.data;
  next();
};

module.exports = { jobSchema, validate };
