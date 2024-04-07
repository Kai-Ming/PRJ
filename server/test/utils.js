/* eslint-disable no-unused-vars */
const User = require("../models/userModel");
const Device = require("../models/deviceModel");
const DeviceData = require("../models/deviceDataModel");
const jwt = require("jsonwebtoken");

const chai = require("chai");
const should = chai.should();

const flushDB = async () => {
  await User.deleteMany({});
  await Device.deleteMany({});
  await DeviceData.deleteMany({});
};

const assertError = (res, code) => {
  res.should.have.status(code);
  res.body.should.be.a("object");
  res.body.should.have.property("error");
  res.body.should.have.property("message");
  res.body.should.have.property("status");
  res.body.should.have.property("stacktrace");
};

const generateToken = (user) => {
  return jwt.sign({ id:user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_VALID_FOR
  });
};

module.exports = {
  flushDB,
  assertError,
  generateToken
};