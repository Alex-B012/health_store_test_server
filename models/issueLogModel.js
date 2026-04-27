import mongoose from "mongoose";

const issueLogSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  telegram_id: { type: Number, required: true },
  comment: { type: String },
});

issueLogSchema.index({ telegram_id: 1, date: -1 });
issueLogSchema.index({ product_id: 1, date: -1 });

const issueLogModel =
  mongoose.models.issueLog || mongoose.model("issueLog", issueLogSchema);

export default issueLogModel;
