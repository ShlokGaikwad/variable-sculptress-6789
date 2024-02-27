const express = require("express");
const RoomModel = require("../models/roomModel");

const roomRouter = express.Router();
/**
 * @swagger
 * tags:
 *   name: Rooms
 *   description: API operations related to rooms
 */

/**
 * @swagger
 * /rooms:
 *   post:
 *     tags: [Rooms]
 *     summary: Create a new room
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             roomTitle: "room1"
 *             userID: ["user1", "user2"]
 *             resultID: ["result1", "result2"]
 *     responses:
 *       200:
 *         description: Room saved successfully
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             example:
 *               error: "Error details"
 */
roomRouter.post("/", async (req, res) => {
  try {
    const room = new RoomModel(req.body);
    await room.save();
    res.status(200).json({ message: "Room saved successfully" });
  } catch (error) {
    res.status(400).json({ error });
  }
});

/**
 * @swagger
 * /rooms:
 *   get:
 *     tags: [Rooms]
 *     summary: Get all rooms
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               message: "All Room"
 *               room: ["room1", "room2"]
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             example:
 *               error: "Error details"
 */
roomRouter.get("/", async (req, res) => {
  try {
    const room = await RoomModel.find();
    res.status(200).json({ message: "All Room", room });
  } catch (error) {
    res.status(400).json({ error });
  }
});

module.exports = roomRouter;
