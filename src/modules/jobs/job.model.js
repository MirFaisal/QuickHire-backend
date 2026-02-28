const mongoose = require("mongoose");
const softDeletePlugin = require("../../middleware/softDelete");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

// Soft delete
jobSchema.plugin(softDeletePlugin);

// Indexes for fast search & filter queries
jobSchema.index({ title: "text", company: "text", description: "text" });
jobSchema.index({ category: 1, createdAt: -1 });
jobSchema.index({ location: 1 });
jobSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Job", jobSchema);
