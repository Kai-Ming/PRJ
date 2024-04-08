const DeviceData = require("../models/deviceDataModel");
const asyncHandler = require("express-async-handler");

const createDeviceData = asyncHandler(async (req, res) => {
    const { deviceId, data, deviceCategory, canBeAccessedBy } = req.body;

    const userId = req.user.id
    if (req.user.type != 'third') {
        try {
            const deviceData = await DeviceData.create({
                deviceId,
                userId,
                data,
                deviceCategory,
                canBeAccessedBy,
            });
            res.status(201).json({
                _id: deviceData.id,
                deviceId: deviceData.deviceId,
                userId: deviceData.userId,
                data: deviceData.data,
                deviceCategory: deviceData.deviceCategory,
                canBeAccessedBy: deviceData.canBeAccessedBy,
            });
        } catch (error) {
            res.status(400);
            throw error;
        }
    }
    else {        
        res.status(400);
        throw new Error("Can't create device data");
    }
});

const getDeviceData = asyncHandler(async (req, res) => {        
    try {
        if (req.user.type != 'third') {
            // User is requesting their own data
            const deviceData = await DeviceData.find({ userId: req.user.id });
            res.status(200).json(deviceData);
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
        console.log(error)
        res.status(400);
        throw error;
    }
});

module.exports = { createDeviceData, getDeviceData };
