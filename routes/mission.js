const express = require("express");
const { createMission } = require("../controllers/missionController");
const auth = require("../middleware/auth");
const router = express.Router();
const { Mission } = require("../models/mission");


router.post("/", auth, createMission);

router.get("/", async (req, res) => {
 try{
  let query = {};

  if (req.query.status) {
    query = { 'status': req.query.status };
  }
  
  const mission = await Mission.find(query);
  res.send(mission);

 } catch (ex) {
  console.log(ex);
  res.status(500).send("internal server error");
 }
});

router.put("/edit/:id", auth, async (req, res) => {
  try{
    const mission = await Mission.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      status: req.body.status,
      description: req.body.description,
      joinLink: req.body.joinLink
    });
  
    if (!mission)
    return res
      .status(404)
      .send("The mission info with the given ID was not found.");
      
    res.send(mission);

  } catch (ex) {
    console.log(ex);
    res.status(500).send("internal server error");
  }
});

router.delete("/delete/:id", auth, async (req, res) => {
  try {
    const mission = await Mission.findByIdAndDelete(req.params.id);

    if (!mission)
      return res.status(404).send("The mission with the given ID was not found.");

    res.send(mission);
  } catch (ex) {
    console.log(ex);
    res.status(500).send("Internal server error");
  }
});


module.exports = router;
