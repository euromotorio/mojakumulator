import { FC, useContext, useState } from "react";
import { Product } from "../../../../util/types";
import "./ProductCard.css";
import {
	UserContext,
	UserContextType
} from "../../../../util/context/UserContext";
import { baseApiUrl } from "../../../../util/config/baseApiUrl";
import { CircularProgress } from "@mui/material";

interface ProductCardProps {
	product: Product;
}

const ProductCard: FC<ProductCardProps> = ({ product }) => {
	const { user } = useContext<UserContextType>(UserContext);
	const [clicked, setClicked] = useState<boolean>(false);

	const addToCartHandler = async () => {
		try {
			await fetch(`${baseApiUrl}/users/cart/add/${product.id}`, {
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
			}, 2000);
		}
	};

	return (
		<div className="card">
			<div>
				<img src={product.imgUrl} width={250} />
				<hr />
				<h3>{product.name}</h3>
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
		</div>
	);
};

export default ProductCard;
