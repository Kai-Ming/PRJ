const mongoose = require("mongoose");
const permissions = require("../roles");

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
        type: {
            type: String,
            required: [true, "Please add a device type"],
        },
        permission: {
            type: Number,
            enum: Object.values(permissions),
            default: permissions.NONE,
        },
    },
);

module.exports = mongoose.model("Device", deviceSchema);