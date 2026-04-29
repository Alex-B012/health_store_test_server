import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProductName",
    required: true,
  },
  stock_entry: {
    qr_code: { type: String, required: true },
    date: { type: Date },
    employee_id: { type: Number },
  },
  pharmacy_id: { type: Number },
  sale_entry: {
    date: { type: Date },
    seller_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "seller",
    },
  },
});

productSchema.index({ "stock_entry.qr_code": 1 }, { unique: true });
productSchema.index({ name_id: 1 });

const productModel =
  mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;
