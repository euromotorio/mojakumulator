import { FC, MouseEvent, useContext, useState } from "react";
import { Product } from "../../../../util/types";
import "./ProductCard.css";
import {
	UserContext,
	UserContextType
} from "../../../../util/context/UserContext";
import { baseApiUrl } from "../../../../util/config/baseApiUrl";
import { CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";
import {
	CartContext,
	CartContextType
} from "../../../../util/context/CartContext";

interface ProductCardProps {
	product: Product;
}

const ProductCard: FC<ProductCardProps> = ({ product }) => {
	const { user } = useContext<UserContextType>(UserContext);
	const { addToCart } = useContext<CartContextType>(CartContext);

	const [clicked, setClicked] = useState<boolean>(false);

	const addToCartHandler = async (event: MouseEvent) => {
		event.preventDefault();

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

	return (
		<Link
			to={`/proizvodi/${product.id}`}
			className={`card ${!product.inStock && "card-disabled"}`}
		>
			{!product.inStock && <div className="card-overlay">Nema na stanju</div>}
			<div>
				<img src={product.imgUrl} width={250} />
				<hr />
				<h3>
					{product.name.includes("99")
						? product.name.replace("99", "1")
						: product.name.replace(/\b0+(\d+Ah)/, "$1")}
				</h3>
			</div>
			<div>
				<b>{product.price.toFixed(2)}KM</b>
				<button
					onClick={addToCartHandler}
					disabled={clicked}
					className={`${clicked && "clicked"} add-to-cart-button`}
				>
					{clicked ? <CircularProgress size="1em" /> : "Dodaj u korpu"}
				</button>
			</div>
		</Link>
	);
};

export default ProductCard;
