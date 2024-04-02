const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const missionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  description: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 400,
  },
  joinLink: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 400,
  }
});

function validateMission(mission) {
  const schema = Joi.object({
    title: Joi.string().min(5).max(255).required(),
    status: Joi.string().valid("active", "inactive"),
    description: Joi.string().min(5).max(400).required(),
    joinLink: Joi.string().min(5).max(400).required(),
  });

  return schema.validate(mission);
}

const Mission = mongoose.model("Mission", missionSchema);

exports.missionSchema = missionSchema;
exports.Mission = Mission;
exports.validate = validateMission;
