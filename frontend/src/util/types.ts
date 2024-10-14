export type Brand = "urban" | "exide";

export interface Product {
	id: string;
	imgUrl: string;
	name: string;
	price: number;
	brand: Brand;
	dimensions: string;
	warranty: number;
	code: number;
}

type UserAccessLevel = "user" | "admin";

export interface User {
	id: string;
	name: string;
	token: string;
	access: UserAccessLevel | "";
}

export interface ShoppingCartItem extends Product {
	count: number;
}

export interface ShoppingCart {
	products: Array<ShoppingCartItem> | [];
	sum: number;
}
