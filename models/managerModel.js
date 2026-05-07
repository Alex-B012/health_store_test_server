import mongoose from "mongoose";

const managerSchema = new mongoose.Schema({
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
    startDate: { type: Date },
    endDate: { type: Date },
  },
  location_id: { type: Number },
  telegram_id: { type: Number, required: true },
});

managerSchema.index({ telegram_id: 1 }, { unique: true });

const managerModel =
  mongoose.models.manager || mongoose.model("manager", managerSchema);

export default managerModel;
