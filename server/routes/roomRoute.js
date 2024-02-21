const express = require("express");
const RoomModel = require("../models/roomModel");

const roomRouter = express.Router();

roomRouter.post("/", async (req, res) => {
  try {
    const room = new RoomModel(req.body);
    await room.save();
    res.status(200).json({ message: "Room saved successfully" });
  } catch (error) {
    res.status(400).json({ error });
  }
});

roomRouter.get("/", async (req, res) => {
  try {
    const room = await RoomModel.find();
    res.status(200).json({ message: "All Room", room });
  } catch (error) {
    res.status(400).json({ error });
  }
});

module.exports = roomRouter;
