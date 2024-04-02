"use strict";

require("dotenv").config();

module.exports = {
  PORT: process.env.PORT,
  mongoURI: process.env.mongoURI,
  JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY,
  API_KEY: process.env.API_KEY,
};
