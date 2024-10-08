const mongoose = require("mongoose");
const userCategory = require("../userCategories");
const thirdPartyCategory = require("../thirdPartyCategories");

const userSchema = mongoose.Schema(
	{
		name: {
			type: String,
			maxLength: [20, "Name must be 20 characters or below"],
			required: [true, "Please add a username"],
		},
		email: {
			type: String,
			validate: {
				validator: function (v) {
				return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(v);
				},
				message: (props) => `${props.value} is not a valid email address`,
			},
			maxLength: [254, "Email address is too long"],
			unique: true,
			required: [true, "Please add an email"],
		},
		password: {
			type: String,
			required: [true, "Please add a password"],
		},
		type: {
			type: String,
			enum: ['main', 'third'],
			default: 'main',
			required: true,
		},
		userCategory: {
			type: String,
			enum: Object.values(userCategory),
			default: userCategory.PRIVATE,			
		},
		thirdPartyCategory: {
			type: String,
			enum: Object.values(thirdPartyCategory),
			default: thirdPartyCategory.OTHERS,
		}
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("User", userSchema);