import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Введите название продукта"],
  },
  name_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  stock_entry: {
    qr_code: { type: String },
    date: { type: Date },
    employee_id: { type: Number },
  },
  pharmacy_id: { type: Number },
  sale_entry: {
    qr_code: { type: String, required: true },
    date: { type: Date },
    seller_id: { type: String, required: true },
  },
});

productSchema.index({ "sale_entry.qr_code": 1 }, { unique: true });

const productModel =
  mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;
