export type Brand = "urban" | "exide";

export interface Product {
	id: string;
	imgUrl: string;
	name: string;
	price: number;
	b2cPrice?: number;
	brand: Brand;
	dimensions: string;
	warranty: number;
	code: number;
	b2cCode: number;
	inStock: boolean;
	subBrand: string;
}

type UserAccessLevel = "user" | "admin";

export interface User {
	id: string;
	name: string;
	token: string;
	access: UserAccessLevel | "";
}

export interface ReturningProduct {
	vehicle: string;
	productionYear: number;
	engineVolume: number;
	startStop: "Da" | "Ne";
}

export interface ShoppingCartItem extends Product {
	count: number;
	returningProduct: ReturningProduct;
	isDiscounted: boolean;
}

export interface ShoppingCart {
	products: Array<ShoppingCartItem>;
	sum: number;
}

export interface PageData {
	subBrand: string;
	akus: Array<ShoppingCartItem>;
}
