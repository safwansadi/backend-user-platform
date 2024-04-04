const express = require('express');
const router = express.Router();
const serverless = require('serverless-http');
const error = require("../middleware/error");
const cors = require('cors');
const apikeyAuthMiddleware = require("../middleware/apikeyAuthMiddleware")
const Joi = require("@hapi/joi");
const bcrypt = require("bcryptjs");
const _ = require("lodash");
const { User, validate } = require("../models/user");
const { createMission } = require("../controllers/missionController");
const auth = require("../middleware/auth");
const { Mission} = require("../models/mission");
const {mongoURI} = require("../utils/env");
const mongoose = require('mongoose');

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));
    
const app = express(); 

const corsOptions = { 
  origin: 'https://frontend-userplatform-updated.netlify.app',
};

app.use(cors(corsOptions));
app.use(apikeyAuthMiddleware);

app.use(express.json());

router.get("/",(req, res)=>{
  res.send("app is running...")
});

router.post("/auth", async (req, res) => {
  const { error } = validateAuth(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send({status:200, message :"Invalid email or password."});

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send({status:200, message :"Invalid email or password."});

  const token = user.generateAuthToken();
  res.status(200).send({status:200, token: token});
});

function validateAuth(req) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(4).max(255).required(),
  });

  return schema.validate(req);
}

router.post("/users", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send({message:error.details[0].message});

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send({message:"User already registered."});

  user = new User(_.pick(req.body, ["name", "email", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  res.status(200).send({token: token});
});

router.post("/mission", auth, createMission);

router.get("/mission", async (req, res) => {
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
 
 router.put("/mission/edit/:id", auth, async (req, res) => {
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
 
 router.delete("/mission/delete/:id", auth, async (req, res) => {
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


app.use(error);

// Mount router at the specified base path
app.use('/.netlify/functions/api', router);

module.exports.handler = serverless(app);
