import React from "react";

export interface CartContextType {
	cartCount: number;
	addToCart: () => void;
	removeFromCart: () => void;
	clearCart: () => void;
}

export const CartContext = React.createContext<CartContextType>({
	cartCount: 0,
	addToCart: () => {},
	removeFromCart: () => {},
	clearCart: () => {}
});
