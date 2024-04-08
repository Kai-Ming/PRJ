const Device = require("../models/deviceModel");
const asyncHandler = require("express-async-handler");
//const deviceCategory = require("../deviceCategories");

const createDevice = asyncHandler(async (req, res) => {
    const { name, deviceCategory } = req.body;
    if (!name || !deviceCategory) {
        res.status(400);
        throw new Error("Please enter all fields");
    }

    if (req.user.type == 'main') {
        const userId = req.user.id
        try {
            const device = await Device.create({
                name,
                userId,
                deviceCategory,
            });
            res.status(201).json({
                _id: device.id,
                userId: device.userId,
                name: device.name,
                deviceCategory: device.deviceCategory,
            });
        } catch (error) {
            res.status(400);
            throw error;
        }
    }
    else {
        res.status(400);
        throw new Error("Can't create device");
    }
});

const getDevices = asyncHandler(async (req, res) => {
    if (req.user.type == 'main') {
        const devices = await Device.find({ userId: req.user.id });
        res.status(200).json(devices);
    }
    else {
        res.status(404);
        throw new Error("Can't get devices")
    }
});


module.exports = { createDevice, 
                    getDevices
                };
