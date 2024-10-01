import { ObjectId } from "mongoose";
import { AkuInterface } from "../models/aku";

export type Brand = "exide" | "urban";

type UserAccessLevel = "user" | "admin";

export interface Aku {
	name: string;
	brand: Brand;
	price: number;
	imgUrl: URL;
}

export interface User {
	name: string;
	username: string;
	password: string;
	access: UserAccessLevel;
	shoppingCart: Array<AkuInterface>;
}

export interface CartItem extends Aku {
	id: ObjectId;
	count: number;
}
