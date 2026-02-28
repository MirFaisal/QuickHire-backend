const mongoose = require("mongoose");
const softDeletePlugin = require("../../middleware/softDelete");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  { timestamps: true },
);

// Soft delete
categorySchema.plugin(softDeletePlugin);

module.exports = mongoose.model("Category", categorySchema);
