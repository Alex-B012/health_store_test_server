import mongoose from "mongoose";

const managerSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: {
    firstName: { type: String, required: [true, "First name is required"] },
    patronymic: { type: String, required: false },
    lastName: { type: String, required: [true, "Surname is required"] },
  },
  dob: {
    type: Date,
  },
  employmentPeriod: {
    status: { type: String, enum: ["active", "non-active"], default: "active" },
    startDate: { type: Date },
    endDate: { type: Date },
  },
  location_id: { type: Number },
  telegram_id: { type: Number, required: true },
  phone: {
    type: String,
    trim: true,
    validate: {
      validator: function (v) {
        if (!v) return true;
        return /^\+?\d{5,20}$/.test(v);
      },
      message: "Введите корректный номер телефона без пробелов и дефисов",
    },
  },
});

managerSchema.index({ id: 1 }, { unique: true });
managerSchema.index({ telegram_id: 1 }, { unique: true });

const managerModel =
  mongoose.models.manager || mongoose.model("manager", managerSchema);

export default managerModel;
