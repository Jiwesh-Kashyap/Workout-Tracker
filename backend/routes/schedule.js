const express = require("express");
const router = express.Router();
const Schedule = require("../models/schedule.js");

router.get("/", async (req, res) => {
  if (!req.user) {
    return res.status(400).json({ message: "Invalid user!" });
  }
  const plans = await Schedule.find({ createdBy: req.user._id }).sort({
    createdAt: -1,
  });
  res.status(200).json(plans);
});
router.post("/", async (req, res) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ message: "You must be logged in to add a plan" });
  }
  const { dayName, message, checker } = req.body;
  try {
    const plan = await Schedule.create({
      dayName,
      message,
      checker,
      createdBy: req.user._id,
    });
    res.status(200).json({ message: "Plan added to schedule successfully!" });
  } catch (error) {
    console.log("/routes/schedule.js->", error);
    res.status(400);
  }
});
router.put("/", async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Invalid user!" });
  }
  const { dayName } = req.body;
  try {
    const plan = await Schedule.findOne({
      dayName,
      createdBy: req.user._id,
    });

    plan.checker = !plan.checker;

    await plan.save();

    res.status(200).json({ checker: plan.checker });
  } catch (err) {
    console.log("routes/schedule.js-> Error while updating checker", err);
  }
});
router.delete("/", async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Invalid user!" });
  }
  const { dayName } = req.body;
  try {
    const plan = await Schedule.findOne({
      dayName: dayName,
      createdBy: req.user._id,
    });
    if (!plan) {
      console.log("No such plan exists!");
      return res.json(400);
    }
    await plan.deleteOne();
    res.status(200).json({ message: "Plan deleted successfully!" });
  } catch (error) {
    res.status(400).json({ message: "Error while deleting plan!" });
  }
});
module.exports = router;
