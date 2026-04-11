import mongoose from "mongoose";

const productNameSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    brief_description: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

productNameSchema.index({ name: 1 }, { unique: true });

const productNameModel =
  mongoose.models.ProductName ||
  mongoose.model("ProductName", productNameSchema);

export default productNameModel;
