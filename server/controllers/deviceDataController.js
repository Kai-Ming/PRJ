const DeviceData = require("../models/deviceDataModel");
const asyncHandler = require("express-async-handler");
const permissions = require("../permissions");
const roles = require("../roles");

const createDeviceData = asyncHandler(async (req, res) => {
    const { deviceId, data, permission } = req.body;
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
            deviceId: deviceData.deviceId,
            userId: deviceData.user.id,
            data: deviceData.data,
            permission: deviceData.permission,
        });
    } catch (error) {
        res.status(400);
        throw error;
    }
});

const getDeviceData = asyncHandler(async (req, res) => {
    const { name } = req.body;
    if (!name) {
        res.status(400);
        throw new Error("Please enter a device");
    }
    try {
        if (!req.user.thirdParty) {
            // User is requesting their own data
            const deviceData = await DeviceData.find({ name, userId: req.user.id });
            res.status(201).json(deviceData);
        }
        else {
            // 3rd party requesting data of a specific device
            const userRole = req.user.role;

            const levelsPermitted = [];

            for (let key in permissions) {
                if (permissions[key] < userRole) {
                    levelsPermitted.push(permissions[key]);
                }
            }

            const deviceData = await DeviceData.find({ name, userId: req.user.id, permissions: {$in: levelsPermitted} });

            if (!deviceData) {
                res.status(400);
                throw new Error("No data permitted");
            }
            else {
                res.status(201).json(deviceData);
            }
        }

    } catch (error) {
        res.status(400);
        throw error;
    }
});

module.exports = { createDeviceData, getDeviceData };
