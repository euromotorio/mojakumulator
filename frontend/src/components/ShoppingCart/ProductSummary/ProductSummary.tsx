import { FC, useEffect, useState } from "react";
import "./ProductSummary.css";
import { ShoppingCart } from "../../../util/types";
import { CircularProgress } from "@mui/material";
import CartItem from "./CartItem/CartItem";

interface ProductSummaryProps {
	cart: ShoppingCart | undefined;
	onOrder: (value: number) => void;
}

const ProductSummary: FC<ProductSummaryProps> = ({ cart, onOrder }) => {
	const [cartSum, setCartSum] = useState<number>(cart ? cart.sum : 0);

	useEffect(() => {
		if (cart) {
			setCartSum(cart.sum);
		}
	}, [cart]);

	const orderHandler = async () => {
		await onOrder(cartSum);
		setCartSum(0);
	};

	return (
		<div className={`product-summary ${!cart && "loading"}`}>
			{cart ? (
				<div className="scrollable">
					{cart.products?.map((product) => (
						<CartItem
							product={product}
							key={product.id}
							onCartAdd={(value) => setCartSum((prevSum) => prevSum + value)}
							onCartSubtract={(value) =>
								setCartSum((prevSum) => prevSum - value)
							}
						/>
					))}
				</div>
			) : (
				<CircularProgress className="loading-button" />
			)}
			<div className="order-button-container">
				<p className="sum">
					Gotovina: {cartSum ? cartSum.toFixed(2) : (0).toFixed(2)}KM
				</p>
				<button
					disabled={cartSum === 0}
					className={`${cartSum === 0 && "disabled-button"}`}
					onClick={orderHandler}
				>
					Naruči
				</button>
			</div>
		</div>
	);
};

export default ProductSummary;
