const mongoose = require("mongoose");
const deviceCategory = require("../deviceCatgories");

const deviceSchema = mongoose.Schema(
    { 
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        name: {
            type: String,
            maxLength: [20, "Name must be 20 characters or below"],
            required: [true, "Please add a device name"],
        },
        deviceCategory: {
            type: String,
            enum: Object.values(deviceCategory),
            required: true
        },
    },
);

module.exports = mongoose.model("Device", deviceSchema);