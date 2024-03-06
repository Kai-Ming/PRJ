const mongoose = require("mongoose");
const permissions = require("../roles");

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
            type: String,
            enum: Object.keys(permissions),
            requireed: true,
        },  
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("DeviceData", deviceDataSchema);