const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  eventId: String,
  title: String,
  mode: String,
  price: Number,
});

const RegistrationSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  college: String,
  dept: String,
  year: String,

  events: [EventSchema],

  expectedAmount: Number,

  payment: {
    status: {
      type: String,
      enum: ["pending", "paid", "partial", "unpaid"],
      default: "pending",
    },
    utr: String,
    paidAmount: {
      type: Number,
      default: 0,
    },
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Registration", RegistrationSchema);
