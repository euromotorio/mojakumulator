import mongoose from "mongoose";
import { Address, User as UserType } from "../util/types";

export interface UserInterface extends UserType, mongoose.Document {}

const addressSchema = new mongoose.Schema<Address>({
	street: {
		type: String,
		required: true,
		trim: true
	},
	city: {
		type: String,
		required: true,
		trim: true
	},
	zipCode: {
		type: String,
		required: true,
		trim: true
	}
});

const userSchema = new mongoose.Schema<UserInterface>({
	name: {
		type: String,
		required: true,
		trim: true
	},
	username: {
		type: String,
		required: true,
		trim: true
	},
	password: {
		type: String,
		required: true,
		trim: true
	},
	access: {
		type: String,
		required: true,
		trim: true
	},
	shoppingCart: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Aku"
		}
	],
	fullName: {
		type: String,
		required: true,
		trim: true
	},
	address: {
		type: addressSchema,
		required: true
	},
	phone: {
		type: Number,
		required: true,
		trim: true
	}
});

userSchema.set("toJSON", {
	transform: (_document, object) => {
		object.id = object._id.toString();
		delete object._id;
		delete object.__v;
	}
});

export const User = mongoose.model("User", userSchema);
