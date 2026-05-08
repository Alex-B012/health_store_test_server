import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: {
    firstName: { type: String, required: [true, "Укажите имя"] },
    patronymic: { type: String, required: false },
    lastName: { type: String, required: [true, "Укажите фамилию"] },
  },
  dob: {
    type: Date,
  },
  employmentPeriod: {
    status: { type: String, enum: ["active", "non-active"], default: "active" },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
  },
  location_id: { type: Number },
  telegram_id: { type: Number, required: true },
  phone: {
    type: String,
    trim: true,
    validate: {
      validator: function (v) {
        return /^\+?\d{10,15}$/.test(v);
      },
      message: "Введите корректный номер телефона без пробелов и дефисов",
    },
  },
});

sellerSchema.index({ id: 1 }, { unique: true });
sellerSchema.index({ telegram_id: 1 }, { unique: true });

const sellerModel =
  mongoose.models.seller || mongoose.model("seller", sellerSchema);

export default sellerModel;
