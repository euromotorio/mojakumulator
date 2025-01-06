import { FC, MouseEvent, useContext, useState } from "react";
import "./Aku.css";
import { ShoppingCart, ShoppingCartItem } from "../../util/types";
import { useLoaderData } from "react-router-dom";
import { baseApiUrl } from "../../util/config/baseApiUrl";
import { UserContext, UserContextType } from "../../util/context/UserContext";
import { CircularProgress } from "@mui/material";
import { CartContext, CartContextType } from "../../util/context/CartContext";

const Aku: FC = () => {
	const [clicked, setClicked] = useState<boolean>(false);
	const [aku] = useState<ShoppingCartItem>(useLoaderData() as ShoppingCartItem);

	const { user } = useContext<UserContextType>(UserContext);
	const { addToCart } = useContext<CartContextType>(CartContext);

	const addToCartHandler = async (event: MouseEvent) => {
		event.preventDefault();

		if (!user) {
			const storedCart = localStorage.getItem("mojakumulator-cart");
			const cart: ShoppingCart = storedCart
				? JSON.parse(storedCart)
				: { products: [], sum: 0 };

			const existingProductIndex = cart.products.findIndex(
				(item) =>
					item.id === aku.id &&
					(!item.returningProduct ||
						JSON.stringify(item.returningProduct) ===
							JSON.stringify(aku.returningProduct))
			);

			if (existingProductIndex > -1) {
				cart.products[existingProductIndex].count += 1;
			} else {
				cart.products.push({ ...aku, count: 1 });
			}

			cart.sum += aku.price;

			localStorage.setItem("mojakumulator-cart", JSON.stringify(cart));
		}

		try {
			await fetch(`${baseApiUrl}/api/users/cart/add/${aku.id}`, {
				method: "PUT",
				headers: {
					Authorization: `bearer ${user?.token}`
				}
			});
			setClicked(true);
		} catch (error) {
			console.log(error);
		} finally {
			setTimeout(() => {
				setClicked(false);
				addToCart();
			}, 2000);
		}
	};

	return (
		<div className="aku-container">
			<div className="img-container">
				<img src={aku.imgUrl} height={300} />
				<div className="divider"></div>
			</div>
			<div className="mobile-divider"></div>
			<div className="product-info-container">
				<div className="product-info">
					<h1>
						{aku.name.includes("99")
							? aku.name.replace("99", "1")
							: aku.name.replace(/\b0+(\d+Ah)/, "$1")}
					</h1>
					<h3>
						<b>Dimenzije: </b>
						{aku.dimensions}
					</h3>
					<h3>
						<b>Garancija: </b>
						{aku.warranty} mjeseci
					</h3>
				</div>
				<div className="product-price">
					<h2>{user ? aku.price.toFixed(2) : aku.b2cPrice?.toFixed(2)}KM</h2>
					<button
						onClick={addToCartHandler}
						disabled={clicked || !aku.inStock}
						className={`${clicked && "clicked"} ${
							!aku.inStock && "not-in-stock"
						}`}
					>
						{aku.inStock ? (
							clicked ? (
								<CircularProgress size="1.3em" />
							) : (
								"Dodaj u korpu"
							)
						) : (
							"Nema na stanju"
						)}
					</button>
					{!user && (
						<button
							className={`${clicked && "clicked"} ${
								!aku.inStock && "not-in-stock"
							}`}
						>
							{aku.inStock ? "Dodaj uz povrat" : "Nema na stanju"}
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

export default Aku;
