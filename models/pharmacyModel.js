import mongoose from "mongoose";

const { Schema } = mongoose;

const addressSchema = new Schema(
  {
    city: { type: String, required: true, trim: true },
    street: { type: String, required: true, trim: true },
    buildingNumber: { type: String, required: true, trim: true },
    province: { type: String, trim: true },
    zipCode: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const contactSchema = new Schema(
  {
    phone: { type: String, trim: true },
    mobilePhone: { type: String, trim: true },
    email: {
      type: String,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email"],
      lowercase: true,
      trim: true,
    },
    fax: { type: String, trim: true },
    website: { type: String, trim: true },
  },
  { _id: false },
);

const managementSchema = new Schema(
  {
    role: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    roomNumber: { type: String, trim: true },
    phone: { type: String, trim: true },
    mobilePhone: { type: String, trim: true },
    email: {
      type: String,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email"],
      trim: true,
      lowercase: true,
    },
  },
  { _id: false },
);

const businessHoursSchema = new Schema(
  {
    day: {
      type: String,
      required: true,
      enum: [
        "Понедельник",
        "Вторник",
        "Среда",
        "Четверг",
        "Пятница",
        "Суббота",
        "Воскресенье",
      ],
    },
    open: { type: String },
    close: { type: String },
    isClosed: { type: Boolean, default: false },
  },
  { _id: false },
);

const pharmacySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    pharmacyNumber: { type: String, required: true, trim: true },
    addedAt: { type: Date, default: Date.now },
    address: addressSchema,
    contact: contactSchema,
    management: { type: [managementSchema], default: [] },
    businessHours: { type: [businessHoursSchema], default: [] },
  },
  {
    timestamps: true,
  },
);

pharmacySchema.index({ pharmacyNumber: 1 }, { unique: true });

const pharmacyModel =
  mongoose.models.pharmacy || mongoose.model("Pharmacy", pharmacySchema);

export default pharmacyModel;
