const { Mission, validate } = require("../models/mission");

exports.createMission = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { title, status , description, joinLink } = req.body;

  const mission = new Mission({
    title,
    status,
    description,
    joinLink,
  });

  try {
    const savedMission = await mission.save();
    res.status(201).json({ mission: savedMission });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};
