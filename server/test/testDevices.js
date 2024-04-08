/* eslint-disable no-unused-vars */
const mongoose = require("mongoose");
const User = require("../models/userModel.js");
const Device = require("../models/deviceModel.js")

const userCategories = require("../userCategories");
const thirdPartyCategories = require("../thirdPartyCategories");
const deviceCategories = require("../deviceCategories.js")

const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server.js");
const should = chai.should();

const utils = require("./utils.js");
const { it } = require("mocha");

chai.use(chaiHttp);

//TEST DEVICE API

describe("Device tests", () => {

    before(async() => {
        //Flush database before running tests
        await utils.flushDB();

        //Create user for tests
        const USER = {
            name: "Jill",
            email: "jill@example.com",
            password: "123",
            type: "main",
            userCategory: userCategories.PRIVATE,
            thirdPartyCategory: thirdPartyCategories.OTHERS,
        };

        await User.create(USER);
    });

    //Flush database after tests
    after(async () => {await utils.flushDB();});

    //Test model
    describe("Model tests", () => {
        let user;

        beforeEach(async () => {
            //Flush database before running tests
            await utils.flushDB();

            // Create user for tests
            user = await User.create({
                name: "Jill",
                email: "jill@example.com",
                password: "123",
                type: "main",
                userCategory: userCategories.PRIVATE,
                thirdPartyCategory: thirdPartyCategories.OTHERS,
            });
        });

        it("should create and save a valid device", async () => {
            await Device.create({
                userId: user._id,
                name: "Lights",
                deviceCategory: deviceCategories.LIGHTS,
            })
                .catch((error) => {
                    should.not.exist(error, "The device should have been valid");
                })
                .then((device) => {
                    should.exist(device);
                });
        });

        it("should require user id", async () => {
            await Device.create({
                name: "Lights",
                deviceCategory: deviceCategories.LIGHTS,
            })
            .catch((error) => {
                error.should.have.property("name").eql("ValidationError");
            })
            .then((device) => {
                should.not.exist(device, "The device should have been invalid");
            });
        });

        it("should require name", async () => {
            await Device.create({
                userId: user._id,
                deviceCategory: deviceCategories.LIGHTS,
            })
            .catch((error) => {
                error.should.have.property("name").eql("ValidationError");
            })
            .then((device) => {
                should.not.exist(device, "The device should have been invalid");
            });
        });

        it("should require category", async () => {
            await Device.create({
                userId: user._id,
                name: "Lights",
            })
            .catch((error) => {
                error.should.have.property("name").eql("ValidationError");
            })
            .then((device) => {
                should.not.exist(device, "The device should have been invalid");
            });
        });

        it("should not accept invalid category", async () => {
            await Device.create({
                userId: user._id,
                name: "Lights",
                deviceCategory: "invalid",
            })
            .catch((error) => {
                error.should.have.property("name").eql("ValidationError");
            })
            .then((device) => {
                should.not.exist(device, "The device should have been invalid");
            });
        });
    });

    describe("API tests", () => {
        let user;
        let thirdParty;
        let token;
        let thirdPartyToken;
        let device;
        
        before(async () => {
            // Create third party for tests
            const THIRDPARTY = {
                name: "Third",
                email: "third@example.com",
                password: "123",
                type: "third",
                userCategory: userCategories.PRIVATE,
                thirdPartyCategory: thirdPartyCategories.OTHERS,
            }

            await User.create(THIRDPARTY);
        });

        beforeEach(async () => {
            // Flush devices
            await Device.deleteMany({});

            user = await User.findOne({name: "Jill"});
            thirdParty = await User.findOne({name: "Third"});
            token = utils.generateToken(user);
            thirdPartyToken = utils.generateToken(thirdParty);

            // Create device for tests
            const DEVICE = {
                userId: user._id,
                name: "Lights",
                deviceCategory: deviceCategories.LIGHTS,
            };
            device = await Device.create(DEVICE);
        });

        it("should require user to be logged in", async () => {
            const res = await chai.request(server)
                .get("/api/device");
            
            res.should.have.status(404);
        });

        it("should get devices belonging to user", async () => {
            const res = await chai.request(server)
                .get("/api/device/devices")
                .set("Authorization", ("Bearer " + token));

            res.should.have.status(200);
            res.should.have.property("body");
            should.exist(res.body, "Should have gotten an array of devices");
            res.body.length.should.equal(1, "Should have gotten only one device");
            res.body[0].should.have.property("name").eql(device.name);
            res.body[0].should.have.property("deviceCategory").eql(device.deviceCategory);
        });

        it("should not get devices for third party", async () => {            
            const res = await chai.request(server)
                .get("/api/device/devices")
                .set("Authorization", ("Bearer " + thirdPartyToken));

            res.should.have.status(404);
        });

        it("should create a valid device through POST /api/device", async () => {
            let validDevice = {
                userId: user._id,
                name: "Locks",
                deviceCategory: deviceCategories.LOCKS,
            }

            const res = await chai.request(server)
                .post("/api/device")
                .send(validDevice)
                .set("Authorization", ("Bearer " + token));

            res.should.have.status(201);
            res.body.should.be.a("object");
            res.body.should.have.property("_id");
            res.body.should.have.property("name").eql(validDevice.name);
            res.body.should.have.property("deviceCategory").eql(validDevice.deviceCategory);
        }); 

        it("should not allow third parties to create devices", async () => {
            let thirdPartyDevice = {
                userId: thirdParty._id,
                name: "Thermostat",
                deviceCategory: deviceCategories.THERMOSTAT,
            }

            const res = await chai.request(server)
                .post("/api/device")
                .send(thirdPartyDevice)
                .set("Authorization", ("Bearer " + thirdPartyToken));

            res.should.have.status(400);
        });
    });
});