export interface Product {
	id: string;
	imgUrl: string;
	name: string;
	price: number;
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
