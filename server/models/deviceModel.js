const mongoose = require("mongoose");
const deviceCategory = require("../deviceCategories");

const deviceSchema = mongoose.Schema(
    { 
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        name: {
            type: String,
            required: [true, "Please add a device name"],
        },
        deviceCategory: {
            type: String,
            enum: Object.values(deviceCategory),
            required: true,
        },
    },
);

module.exports = mongoose.model("Device", deviceSchema);