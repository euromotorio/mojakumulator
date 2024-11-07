import { ObjectId } from "mongoose";
import { AkuInterface } from "../models/aku";

export type Brand = "exide" | "urban";

type UserAccessLevel = "user" | "admin";

export interface Aku {
	name: string;
	brand: Brand;
	price: number;
	imgUrl: URL;
	warranty: number;
	dimensions: string;
	code: number;
	inStock: boolean;
	subBrand: string;
}

export interface Address {
	street: string;
	zipCode: string;
	city: string;
}

export interface User {
	name: string;
	username: string;
	password: string;
	access: UserAccessLevel;
	shoppingCart: Array<AkuInterface>;
	fullName: string;
	address: Address;
	phone: number;
}

export interface CartItem extends Aku {
	id: ObjectId;
	count: number;
}
