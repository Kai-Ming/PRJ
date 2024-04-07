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
        data: {
            type: String,
            required: true,
        },
        deviceCategory: {
            type: String,
            enum: Object.values(deviceCategories),
            required: true,
        },
        canBeAccessedBy: {
            type: [String],
            required: true,
        }  
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("DeviceData", deviceDataSchema);