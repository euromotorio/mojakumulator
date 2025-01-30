import { FC, MouseEvent, useContext, useState } from "react";
import { ShoppingCart, ShoppingCartItem } from "../../../../util/types";
import "./ProductCard.css";
import {
	UserContext,
	UserContextType
} from "../../../../util/context/UserContext";
import { baseApiUrl } from "../../../../util/config/baseApiUrl";
import { CircularProgress, Tooltip } from "@mui/material";
import { Link } from "react-router-dom";
import {
	CartContext,
	CartContextType
} from "../../../../util/context/CartContext";

interface ProductCardProps {
	product: ShoppingCartItem;
	onModalOpen: (id: string) => void;
	onMakeDiscounted: (value: boolean) => void;
}

const ProductCard: FC<ProductCardProps> = ({
	product,
	onModalOpen,
	onMakeDiscounted
}) => {
	const { user } = useContext<UserContextType>(UserContext);
	const { addToCart } = useContext<CartContextType>(CartContext);

	const [clicked, setClicked] = useState<boolean>(false);
	const [productPrice, setProductPrice] = useState<number>(product.b2cPrice!);

	const addToCartHandler = async (event: MouseEvent) => {
		event.preventDefault();

		if (!user) {
			setClicked(true);
			const storedCart = localStorage.getItem("mojakumulator-cart");
			const cart: ShoppingCart = storedCart
				? JSON.parse(storedCart)
				: { products: [], sum: 0 };

			const existingProductIndex = cart.products.findIndex(
				(item) =>
					item.id === product.id &&
					(!item.returningProduct ||
						JSON.stringify(item.returningProduct) ===
							JSON.stringify(product.returningProduct))
			);

			if (existingProductIndex > -1) {
				cart.products[existingProductIndex].count += 1;
			} else {
				cart.products.push({ ...product, count: 1 });
			}

			cart.sum += product.b2cPrice!;

			localStorage.setItem("mojakumulator-cart", JSON.stringify(cart));

			setTimeout(() => {
				setClicked(false);
			}, 2000);

			addToCart();

			return;
		}

		try {
			await fetch(`${baseApiUrl}/api/users/cart/add/${product.id}`, {
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

	const discountHandler = (event: MouseEvent) => {
		event.preventDefault();
		onModalOpen(product.id);
		onMakeDiscounted(false);
	};

	const realDiscountHandler = (event: MouseEvent) => {
		event.preventDefault();
		discountHandler(event);
		onMakeDiscounted(true);
	};

	return (
		<Link
			to={`/proizvodi/${product.id}${!user ? "?b2c=true" : ""}`}
			className={`card ${!product.inStock && "card-disabled"}`}
		>
			{!product.inStock && user && (
				<div className="card-overlay">Nema na stanju</div>
			)}
			<div>
				<img src={product.imgUrl} width={250} />
				<hr />
				<h3>
					{product.name.includes("99")
						? `${!user ? product.b2cCode : product.code} ${product.name.replace(
								"99",
								"1"
						  )}`
						: `${!user ? product.b2cCode : product.code} ${product.name.replace(
								/\b0+(\d+Ah)/,
								"$1"
						  )}`}
				</h3>
			</div>
			<div>
				<p>Dimenzije: {product.dimensions}</p>
				<p>Garancija: {product.warranty} mjeseca</p>
			</div>
			<div className="product-footer">
				<b>{user ? product.price.toFixed(2) : productPrice.toFixed(2)}KM</b>
				<button
					onClick={user ? addToCartHandler : discountHandler}
					disabled={clicked}
					className={`${clicked && "clicked"} add-to-cart-button  ${
						!product.inStock && "add-to-cart-button-disabled"
					}`}
				>
					{clicked ? <CircularProgress size="1em" /> : "Dodaj u korpu"}
				</button>
				{!user && (
					<Tooltip title="Ostvarite popust od 10% uz povratak starog akumulatora">
						<button
							className={`${clicked && "clicked"} add-to-cart-button`}
							onClick={realDiscountHandler}
							onMouseEnter={() => setProductPrice(product.b2cPrice! * 0.9)}
							onMouseLeave={() => setProductPrice(product.b2cPrice!)}
						>
							Kupi uz povrat akumulatora
						</button>
					</Tooltip>
				)}
			</div>
		</Link>
	);
};

export default ProductCard;
