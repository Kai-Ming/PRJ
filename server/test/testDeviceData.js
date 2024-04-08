/* eslint-disable no-unused-vars */
const mongoose = require("mongoose");
const User = require("../models/userModel.js");
const Device = require("../models/deviceModel.js");
const DeviceData = require("../models/deviceDataModel.js");

const userCategories = require("../userCategories");
const thirdPartyCategories = require("../thirdPartyCategories");
const deviceCategories = require("../deviceCategories.js");
const categoryPresets = require("../categoryPresets.js");

const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server.js");
const should = chai.should();

const utils = require("./utils.js");
const { it } = require("mocha");

chai.use(chaiHttp);

//TEST DEVICE DATA API

describe("Device data tests", () => {

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

    // Test model
    describe("Model tests", () => {
        let user;
        let device;

        beforeEach(async () => {
            //Flush database before running tests
            await utils.flushDB();

            // Create user and device for tests
            user = await User.create({
                name: "Jill",
                email: "jill@example.com",
                password: "123",
                type: "main",
                userCategory: userCategories.PARTLY_PRIVATE,
                thirdPartyCategory: thirdPartyCategories.OTHERS,
            });

            device = await Device.create({
                userId: user._id,
                name: "Lights",
                deviceCategory: deviceCategories.LIGHTS,
            });
        });

        it("should create and save a valid device data", async () => {
            const canBeAccessedBy = categoryPresets[user.userCategory][device.deviceCategory];
            
            await DeviceData.create({
                deviceId: device._id,
                userId: user._id,
                deviceCategory: device.deviceCategory,
                data: "Turned on, 10am",
                canBeAccessedBy,
            })
                .catch((error) => {
                    should.not.exist(error, "The device data should have been valid");
                })
                .then((deviceData) => {
                    should.exist(deviceData);
                });
        });

        it("should require deivce id", async () => {
            const canBeAccessedBy = categoryPresets[user.userCategory][device.deviceCategory];
            
            await DeviceData.create({
                userId: user._id,
                deviceCategory: device.deviceCategory,
                data: "Turned on, 10am",
                canBeAccessedBy
            })
                .catch((error) => {
                    error.should.have.property("name").eql("ValidationError");
                })
                .then((deviceData) => {
                    should.not.exist(deviceData, "The device data should have been invalid");
                });
        });

        it("should require user id", async () => {
            const canBeAccessedBy = categoryPresets[user.userCategory][device.deviceCategory];

            await DeviceData.create({
                deviceId: device._id,
                deviceCategory: device.deviceCategory,
                data: "Turned on, 10am",
                canBeAccessedBy
            })
                .catch((error) => {
                    error.should.have.property("name").eql("ValidationError");
                })
                .then((deviceData) => {
                    should.not.exist(deviceData, "The device data should have been invalid");
                });
        });

        it("should require device category", async () => {
            const canBeAccessedBy = categoryPresets[user.userCategory][device.deviceCategory];

            await DeviceData.create({
                deviceId: device._id,
                userId: user._id,
                data: "Turned on, 10am",
                canBeAccessedBy
            })
                .catch((error) => {
                    error.should.have.property("name").eql("ValidationError");
                })
                .then((deviceData) => {
                    should.not.exist(deviceData, "The device data should have been invalid");
                });
        });

        it("should require data", async () => {
            const canBeAccessedBy = categoryPresets[user.userCategory][device.deviceCategory];
            
            await DeviceData.create({
                deviceId: device._id,
                userId: user._id,
                deviceCategory: device.deviceCategory,
                canBeAccessedBy
            })
                .catch((error) => {
                    error.should.have.property("name").eql("ValidationError");
                })
                .then((deviceData) => {
                    should.not.exist(deviceData, "The device data should have been invalid");
                });
        });

        it("should not require can be accessed by", async () => {            
            await DeviceData.create({
                deviceId: device._id,
                userId: user._id,
                deviceCategory: device.deviceCategory,
                data: "Turned on, 10am",
            })
                .catch((error) => {
                    should.not.exist(error, "The device data should have been valid");
                })
                .then((deviceData) => {
                    should.exist(deviceData);
                });
        });

        it("should not accept invalid device category", async () => {
            const canBeAccessedBy = categoryPresets[user.userCategory][device.deviceCategory];
            
            await DeviceData.create({
                deviceId: device._id,
                userId: user._id,
                deviceCategory: "INVALID",
                data: "Turned on, 10am",
                canBeAccessedBy
            })
                .catch((error) => {
                    error.should.have.property("name").eql("ValidationError");
                })
                .then((deviceData) => {
                    should.not.exist(deviceData, "The device data should have been invalid");
                });
        });
    });

    describe("API tests", () => {
        let user;
        let thirdParty;
        let token;
        let thirdPartyToken;
        let device1;
        let device2;
        let deviceData1;
        let deviceData2;

        before(async () => {
            // Create third party for tests
            const THIRDPARTY = {
                name: "Third",
                email: "third@example.com",
                password: "123",
                type: "third",
                userCategory: userCategories.PRIVATE,
                thirdPartyCategory: thirdPartyCategories.ENERGY_COMPANY,
            }
            await User.create(THIRDPARTY);
            
            // Create devices for tests
            const USER = await User.findOne({name: "Jill"})
            device1 = await Device.create({
                userId: USER._id,
                name: "Lights",
                deviceCategory: deviceCategories.LIGHTS,
            });
            device2 = await Device.create({
                userId: USER._id,
                name: "Locks",
                deviceCategory: deviceCategories.LOCKS,
            });
        });

        beforeEach(async () => {
            // Flush device data
            await DeviceData.deleteMany({});

            user = await User.findOne({name: "Jill"});
            thirdParty = await User.findOne({name: "Third"});
            token = utils.generateToken(user);
            thirdPartyToken = utils.generateToken(thirdParty);
            device1 = await Device.findOne({name: "Lights"});

            // Create device data for tests
            deviceData1 = await DeviceData.create({
                deviceId: device1._id,
                userId: user._id,
                deviceCategory: device1.deviceCategory,
                data: "Turned on, 10am",
                canBeAccessedBy: categoryPresets[user.userCategory][device1.deviceCategory]
            });

            deviceData2 = await DeviceData.create({
                deviceId: device2._id,
                userId: user._id,
                deviceCategory: device2.deviceCategory,
                data: "Unlocked at 3pm",
                canBeAccessedBy: categoryPresets[user.userCategory][device2.deviceCategory]
            });
        });

        it("should require user to be logged in", async () => {
            const res = await chai.request(server)
                .get("/api/device");
            
            res.should.have.status(404);
        });

        it("should get device data belonging to user", async () => {
            const res = await chai.request(server)
                .get("/api/data/deviceData")
                .set("Authorization", ("Bearer " + token));

            res.should.have.status(200);
            res.should.have.property("body");
            should.exist(res.body, "Should have gotten an array of device data");
            res.body.length.should.equal(2, "Should have gotten only two device data");
            res.body[0].should.have.property("deviceCategory").eql(deviceData1.deviceCategory);
            res.body[0].should.have.property("data").eql(deviceData1.data);
            res.body[0].should.have.property("canBeAccessedBy").eql(deviceData1.canBeAccessedBy);
            res.body[1].should.have.property("deviceCategory").eql(deviceData2.deviceCategory);
            res.body[1].should.have.property("data").eql(deviceData2.data);
            res.body[1].should.have.property("canBeAccessedBy").eql(deviceData2.canBeAccessedBy);
        });

        it("should create a valid device data through POST /api/data", async () => {
            let validDeviceData = {
                deviceId: device2._id,
                userId: user._id,
                deviceCategory: device2.deviceCategory,
                data: "Locked at 3:10pm",
                canBeAccessedBy: categoryPresets[user.userCategory][device2.deviceCategory]
            }

            const res = await chai.request(server)
                .post("/api/data")
                .send(validDeviceData)
                .set("Authorization", ("Bearer " + token));

            res.should.have.status(201);
            res.body.should.be.a("object");
            res.body.should.have.property("_id");
            res.body.should.have.property("deviceCategory").eql(validDeviceData.deviceCategory);
            res.body.should.have.property("data").eql(validDeviceData.data);
            res.body.should.have.property("canBeAccessedBy").eql(validDeviceData.canBeAccessedBy);
        });

        it("should not allow a third party to create device data", async () => {
            let thirdPartyDeviceData = {
                deviceId: device2._id,
                userId: thirdParty._id,
                deviceCategory: device2.deviceCategory,
                data: "Locked at 3:10pm",
                canBeAccessedBy: categoryPresets[user.userCategory][device2.deviceCategory]
            }

            const res = await chai.request(server)
                .post("/api/data")
                .send(thirdPartyDeviceData)
                .set("Authorization", ("Bearer " + thirdPartyToken));

            res.should.have.status(400);
        });

        it("should only give third party device data they are permitted to", async () => {
            const res = await chai.request(server)
                .get("/api/data/deviceData")
                .set("Authorization", ("Bearer " + thirdPartyToken));

            res.should.have.status(201);
            res.should.have.property("body");
            should.exist(res.body, "Should have gotten an array of device data");
            res.body.length.should.equal(1, "Should have gotten only one device data");
            res.body[0].should.have.property("deviceCategory").eql(deviceData1.deviceCategory);
            res.body[0].should.have.property("data").eql(deviceData1.data);
            res.body[0].should.have.property("canBeAccessedBy").eql(deviceData1.canBeAccessedBy);
        });
    });
});