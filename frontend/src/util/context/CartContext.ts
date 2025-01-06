import React from "react";

export interface CartContextType {
	cartCount: number;
	addToCart: () => void;
	removeFromCart: (count: number) => void;
}

export const CartContext = React.createContext<CartContextType>({
	cartCount: 0,
	addToCart: () => {},
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	removeFromCart: (_count: number) => {}
});
