const Device = require("../models/deviceModel");
const asyncHandler = require("express-async-handler");
const permissions = require("../roles");

const createDevice = asyncHandler(async (req, res) => {
    const { name, type, status, permission } = req.body;
    if (!name || !type || !status || !permission) {
        res.status(400);
        throw new Error("Please enter all fields");
    }
    
    try {
        const device = await Device.create({
            name,
            type,
            status,
            permission,
        });
        res.status(201).json({
            _id: device.id,
            name: device.name,
            type: device.type,
            status: device.status,
            permission: device.permission,
    });
    } catch (error) {
        res.status(400);
        throw error;
    }
});

const getDevices = asyncHandler(async (req, res) => {
    const devices = await Device.find({ userId: req.user.id });
    res.status(200).json(devices);
});

const changeDevicePermisssions = asyncHandler(async (req, res) => {
    const { permission } = req.body;
    if (!permission) {
        res.status(400);
        throw new Error("Please enter permission");
    }
    if (!permissions[permission]) {
        res.status(400);
        throw new Error("Invalid permission");
    }
    try {
        const device = await Device.findById(req.params.id);
        if (device) {
            device.permission = permission;
            await device.save();
            res.json({
                _id: device.id,
                name: device.name,
                type: device.type,
                status: device.status,
                permission: device.permission,
            });
        } else {
            res.status(404);
            throw new Error("Device not found");
        }
    } catch (error) {
        res.status(400);
        throw error;
    }
});

module.exports = { createDevice, 
                    changeDevicePermisssions 
                };
