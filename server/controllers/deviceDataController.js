const DeviceData = require("../models/deviceDataModel");
const asyncHandler = require("express-async-handler");
const permissions = require("../roles");

const createDeviceData = asyncHandler(async (req, res) => {
    const { deviceId, data } = req.body;
    if (!deviceId || !data ) {
        res.status(400);
        throw new Error("Please enter all fields");
    }
    if (!permissions[permission]) {
        res.status(400);
        throw new Error("Invalid permission");
    }
    try {
        const deviceData = await DeviceData.create({
            deviceId,
            userId,
            data,
            permission,
        });
        res.status(201).json({
            _id: deviceData.id,
            deviceId: deviceData.deviceId,
            userId: req.user.id,
            data: deviceData.data,
            permission: de.permission,
        });
    } catch (error) {
        res.status(400);
        throw error;
    }
});

const getDeviceData = asyncHandler(async (req, res) => {
    const { deviceId } = req.body;
    if (!deviceId) {
        res.status(400);
        throw new Error("Please enter device id");
    }
    try {
        if (!req.user.thirdParty) {
            // User is requesting their own data
            const deviceData = await DeviceData.find({ deviceId, userId: req.user.id });
            res.status(201).json(deviceData);
        }
        else {
            const deviceData = await DeviceData.find({ deviceId });
            if (req.user.role == "none") {
                res.status(400);
                throw new Error("No permission");
            }
            else if (req.user.role == "some") {
                const device = await DeviceData.find({ deviceId, permission: "all" });
                res.status(201).json(deviceData);
            }
            else {
                const device = await DeviceData.find({ deviceId, permission: "some" });
                res.status(201).json(deviceData);
            }
        }

    } catch (error) {
        res.status(400);
        throw error;
    }
});

module.exports = { createDeviceData, getDeviceData };
