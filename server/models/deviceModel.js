const mongoose = require("mongoose");
const permissions = require("../roles");

const deviceSchema = mongoose.Schema(
    {
        name: {
            type: String,
            maxLength: [20, "Name must be 20 characters or below"],
            required: [true, "Please add a device name"],
        },
        type: {
            type: String,
            required: [true, "Please add a device type"],
        },
        permission: {
            type: String,
            enum: Object.keys(permissions),
            default: "none",
        },
    },
);

module.exports = mongoose.model("Device", deviceSchema);