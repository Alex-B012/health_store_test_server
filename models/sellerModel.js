import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema({
  name: {
    name: { type: String, required: [true, "First name is required"] },
    patronymic: { type: String, required: false },
    surname: { type: String, required: [true, "Surname is required"] },
  },
  dob: {
    type: Date,
  },
  employmentPeriod: {
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
  },
  location_id: { type: Number },
  telegram_id: { type: Number, required: true },
});

sellerSchema.index({ telegram_id: 1 }, { unique: true });

const sellerModel =
  mongoose.models.seller || mongoose.model("seller", sellerSchema);

export default sellerModel;
