import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name_id: {
    type: Number,
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
    seller_id: { type: Number },
  },
});

productSchema.virtual("seller", {
  ref: "seller",
  localField: "sale_entry.seller_id",
  foreignField: "id",
  justOne: true,
});

productSchema.virtual("productName", {
  ref: "ProductName",
  localField: "name_id",
  foreignField: "name_id",
  justOne: true,
});

productSchema.set("toObject", { virtuals: true });
productSchema.set("toJSON", { virtuals: true });

productSchema.index({ "stock_entry.qr_code": 1 }, { unique: true });
productSchema.index({ name_id: 1 });
productSchema.index({ "sale_entry.seller_id": 1 });

const productModel =
  mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;
