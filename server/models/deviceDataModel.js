const mongoose = require("mongoose");
const permissions = require("../permissions");

const deviceDataSchema = mongoose.Schema(
    {
        deviceId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },  
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        data: {
            type: String,
            required: true,
        },
        permission: {
            type: Number,
            enum: Object.values(permissions),
            required: true,
        },  
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("DeviceData", deviceDataSchema);