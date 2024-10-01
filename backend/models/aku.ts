import mongoose, { ObjectId } from "mongoose";
import { Aku as AkuType } from "../util/types";

export interface AkuInterface extends AkuType, mongoose.Document {
	_id: ObjectId;
}

const akuSchema = new mongoose.Schema<AkuInterface>({
	name: {
		type: String,
		required: true,
		trim: true
	},
	brand: {
		type: String,
		required: true,
		trim: true
	},
	price: {
		type: Number,
		required: true,
		trim: true
	},
	imgUrl: {
		type: String,
		required: true
	}
});

akuSchema.set("toJSON", {
	transform: (_document, object) => {
		object.id = object._id.toString();
		delete object._id;
		delete object.__v;
	}
});

export const Aku = mongoose.model("Aku", akuSchema);
