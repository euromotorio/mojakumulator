import { FC, useContext, useEffect, useState } from "react";
import "./ProductSummary.css";
import { ShoppingCart } from "../../../util/types";
import { CircularProgress } from "@mui/material";
import CartItem from "./CartItem/CartItem";
import {
	UserContext,
	UserContextType
} from "../../../util/context/UserContext";

interface ProductSummaryProps {
	cart: ShoppingCart | undefined;
	onOrder: (value: number) => void;
	onRemoveProduct: (id: string) => void;
	cartReady: boolean;
}

const ProductSummary: FC<ProductSummaryProps> = ({
	cart,
	onOrder,
	onRemoveProduct,
	cartReady
}) => {
	const [cartSum, setCartSum] = useState<number>(cart ? cart.sum : 0);

	const { user } = useContext<UserContextType>(UserContext);

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
							key={product.id + product.b2cPrice}
							onCartAdd={(value) => setCartSum((prevSum) => prevSum + value)}
							onCartSubtract={(value) =>
								setCartSum((prevSum) => prevSum - value)
							}
							onRemoveProduct={onRemoveProduct}
						/>
					))}
				</div>
			) : (
				<div className="loading-container">
					<CircularProgress className="loading-button" />
				</div>
			)}
			<div className="order-button-container">
				<p className="sum">
					Ukupno: {cartSum ? cartSum.toFixed(2) : (0).toFixed(2)}KM
				</p>
				<button
					disabled={(!user && !cartReady) || cartSum === 0}
					className={`${
						(cartSum === 0 || (!user && !cartReady)) && "disabled-button"
					}`}
					onClick={orderHandler}
				>
					Naruči
				</button>
			</div>
		</div>
	);
};

export default ProductSummary;
