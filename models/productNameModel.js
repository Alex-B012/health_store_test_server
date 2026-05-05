import mongoose from "mongoose";

const productNameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  name_id: { type: Number, required: true, trim: true },
  brief_description: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
});

productNameSchema.index({ name_id: 1 }, { unique: true });

const productNameModel =
  mongoose.models.ProductName ||
  mongoose.model("ProductName", productNameSchema);

export default productNameModel;
