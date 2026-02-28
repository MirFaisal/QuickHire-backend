/**
 * Mongoose Soft-Delete Plugin
 *
 * Adds `isDeleted` (Boolean) and `deletedAt` (Date) fields.
 * Automatically excludes soft-deleted docs from all find/count/aggregate queries.
 * Provides instance method `doc.softDelete()` and static `Model.restore(id)`.
 */
module.exports = function softDeletePlugin(schema) {
  // ── Add fields ──
  schema.add({
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date, default: null },
  });

  // ── Auto-filter deleted docs for all queries ──
  const autoFilter = function () {
    const filter = this.getFilter();
    // Only apply if the query doesn't explicitly ask for deleted docs
    if (filter.isDeleted === undefined) {
      this.where({ isDeleted: false });
    }
  };

  // Apply to all find/count variants
  schema.pre("find", autoFilter);
  schema.pre("findOne", autoFilter);
  schema.pre("findOneAndUpdate", autoFilter);
  schema.pre("countDocuments", autoFilter);

  // ── Instance method: soft delete a single doc ──
  schema.methods.softDelete = function () {
    this.isDeleted = true;
    this.deletedAt = new Date();
    return this.save();
  };

  // ── Static: soft delete by ID ──
  schema.statics.softDeleteById = function (id) {
    return this.findByIdAndUpdate(id, { isDeleted: true, deletedAt: new Date() }, { new: true });
  };

  // ── Static: restore a soft-deleted doc ──
  schema.statics.restore = function (id) {
    return this.findOneAndUpdate(
      { _id: id, isDeleted: true },
      { isDeleted: false, deletedAt: null },
      { new: true },
    );
  };

  // ── Static: find including deleted ──
  schema.statics.findWithDeleted = function (filter = {}) {
    return this.find({ ...filter, isDeleted: { $in: [true, false] } });
  };

  // ── Static: find only deleted ──
  schema.statics.findDeleted = function (filter = {}) {
    return this.find({ ...filter, isDeleted: true });
  };
};
