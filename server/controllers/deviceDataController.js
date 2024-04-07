const DeviceData = require("../models/deviceDataModel");
const asyncHandler = require("express-async-handler");
const categoryPreset = require("../categoryPresets");

const createDeviceData = asyncHandler(async (req, res) => {
    const { deviceId, data, deviceCategory } = req.body;
    if (!deviceId || !data ) {
        res.status(400);
        throw new Error("Please enter all fields");
    }

    const userPreset = req.user.userPresetCategory;

    try {
        const deviceData = await DeviceData.create({
            deviceId,
            userId,
            data,
            deviceCategory,
        });
        res.status(201).json({
            deviceId: deviceData.deviceId,
            userId: deviceData.user.id,
            data: deviceData.data,
            deviceCategory: deviceData.deviceCategory,
        });
    } catch (error) {
        res.status(400);
        throw error;
    }
});

const getDeviceData = asyncHandler(async (req, res) => {        
    try {
        if (!req.user.type != 'third') {
            // User is requesting their own data
            const deviceData = await DeviceData.find({ name, userId: req.user.id });
            res.status(201).json(deviceData);
        }
        else {
            // 3rd party requesting data of a specific device
            const thirdPartyCategory = req.user.thirdPartyCategory;

            const deviceData = await DeviceData.find({ canBeAccessedBy: thirdPartyCategory });

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
