const mongoose = require("mongoose");

const roomSchema = mongoose.Schema(
  {
    roomTitle: { type: String, required: true, default: "room1" },
    userID: { type: [String], validate: [arrayLimit] },
    resultID: { type: [String], validate: [arrayLimit] },
  },
  {
    versionKey: false,
  }
);

function arrayLimit(val) {
  return val.length <= 2;
}

const RoomModel = mongoose.model("room", roomSchema);

module.exports = RoomModel;
