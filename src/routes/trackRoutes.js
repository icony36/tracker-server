const express = require("express");
const mongoose = require("mongoose");
const requireAuth = require("../middleware/requireAuth");

const Track = mongoose.model("Track");

const router = express.Router();

router.use(requireAuth);

router.get("/tracks", async (req, res) => {
  const tracks = await Track.find({ userId: req.user._id });

  res.send(tracks);
});

router.post("/tracks", async (req, res) => {
  const { name, locations } = req.body;

  if (!name || !locations) {
    return res
      .status(422)
      .send({ error: "Please provide a name and locations" });
  }
  try {
    const track = new Track({ name, locations, userId: req.user._id });
    await track.save();
    res.send(track);
  } catch (err) {
    res.status(422).send({ error: err.message });
  }
});

router.delete("/tracks", async (req, res) => {
  const { _id } = req.body;

  if (!_id) {
    return res.status(422).send({ err: "Please provide track id" });
  }
  try {
    await Track.findByIdAndDelete(_id);
    res.send(`Track deleted: ${_id}`);
  } catch (err) {
    res.status(422).send({ error: err.message });
  }
});

router.put("/tracks", async (req, res) => {
  const { _id, name } = req.body;

  if (!_id || !name) {
    return res.status(422).send({ err: "Please provide track id and name" });
  }
  try {
    await Track.findByIdAndUpdate(_id, { name }, { useFindAndModify: false });
    res.send(`Track updated: ${_id}`);
  } catch (err) {
    res.status(422).send({ error: err.message });
  }
});

module.exports = router;
