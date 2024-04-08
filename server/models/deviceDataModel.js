const mongoose = require("mongoose");
const deviceCategories = require("../deviceCategories");

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
        deviceCategory: {
            type: String,
            enum: Object.values(deviceCategories),
            required: true,
        },
        data: {
            type: String,
            required: true,
        },
        canBeAccessedBy: {
            type: [String],
        }  
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("DeviceData", deviceDataSchema);