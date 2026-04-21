import mongoose from "mongoose";

const issueLogSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  telegram_id: { type: Number, required: true },
});

const issueLogModel =
  mongoose.models.issueLog || mongoose.model("issueLog", issueLogSchema);

export default issueLogModel;
