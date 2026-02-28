const { z } = require("zod");

const categorySchema = z.object({
  name: z.string({ required_error: "Category name is required" }).min(1, "Category name cannot be empty"),
});

module.exports = { categorySchema };
