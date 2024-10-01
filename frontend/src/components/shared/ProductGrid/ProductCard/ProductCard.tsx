import { FC, useContext } from "react";
import { Product } from "../../../../util/types";
import "./ProductCard.css";
import {
	UserContext,
	UserContextType
} from "../../../../util/context/UserContext";
import { baseApiUrl } from "../../../../util/config/baseApiUrl";

interface ProductCardProps {
	product: Product;
}

const ProductCard: FC<ProductCardProps> = ({ product }) => {
	const { user } = useContext<UserContextType>(UserContext);

	const addToCartHandler = async () => {
		await fetch(`${baseApiUrl}/users/cart/add/${product.id}`, {
			method: "PUT",
			headers: {
				Authorization: `bearer ${user?.token}`
			}
		});
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
				<button onClick={addToCartHandler}>Dodaj u korpu</button>
			</div>
		</div>
	);
};

export default ProductCard;
