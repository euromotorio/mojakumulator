import { FC, useContext, useState } from "react";
import { ShoppingCartItem } from "../../../../util/types";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import "./CartItem.css";
import {
	UserContext,
	UserContextType
} from "../../../../util/context/UserContext";
import { baseApiUrl } from "../../../../util/config/baseApiUrl";

interface CartItemProps {
	product: ShoppingCartItem;
	onCartSubtract: (value: number) => void;
	onCartAdd: (value: number) => void;
}

const CartItem: FC<CartItemProps> = ({
	product,
	onCartAdd,
	onCartSubtract
}) => {
	const [count, setCount] = useState<number>(product.count);

	const { user } = useContext<UserContextType>(UserContext);

	const subtractHandler = async () => {
		setCount((count) => count - 1);
		onCartSubtract(product.price);

		await fetch(`${baseApiUrl}/users/cart/remove/${product.id}`, {
			method: "PUT",
			headers: {
				Authorization: `bearer ${user?.token}`
			}
		});
	};

	const addHandler = async () => {
		setCount((count) => count + 1);
		onCartAdd(product.price);

		await fetch(`${baseApiUrl}/users/cart/add/${product.id}`, {
			method: "PUT",
			headers: {
				Authorization: `bearer ${user?.token}`
			}
		});
	};

	const emptyHandler = async () => {
		setCount(0);
		onCartSubtract(product.price * count);

		await fetch(`${baseApiUrl}/users/cart/clear/${product.id}`, {
			method: "PUT",
			headers: {
				Authorization: `bearer ${user?.token}`
			}
		});
	};

	return (
		<div className="cart-item">
			{count !== 0 && (
				<>
					<div className="flex-item">
						<p className="price-per-product">{product.price * count}KM</p>
						<img src={product.imgUrl} width="150px" />
					</div>
					<div className="flex-item">
						<b>{product.name}</b>
						<div>
							<RemoveIcon onClick={subtractHandler} className="hover-pointer" />
							<p>{count}</p>
							<AddIcon onClick={addHandler} className="hover-pointer" />
						</div>
					</div>
					<DeleteIcon onClick={emptyHandler} className="hover-pointer" />
				</>
			)}
		</div>
	);
};

export default CartItem;
