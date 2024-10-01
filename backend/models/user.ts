import mongoose from "mongoose";
import { User as UserType } from "../util/types";

export interface UserInterface extends UserType, mongoose.Document {}

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
	]
});

userSchema.set("toJSON", {
	transform: (_document, object) => {
		object.id = object._id.toString();
		delete object._id;
		delete object.__v;
	}
});

export const User = mongoose.model("User", userSchema);
