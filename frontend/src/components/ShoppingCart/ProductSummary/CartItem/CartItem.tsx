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
import {
	CartContext,
	CartContextType
} from "../../../../util/context/CartContext";

interface CartItemProps {
	product: ShoppingCartItem;
	onCartSubtract: (value: number) => void;
	onCartAdd: (value: number) => void;
	onRemoveProduct: (id: string) => void;
}

const CartItem: FC<CartItemProps> = ({
	product,
	onCartAdd,
	onCartSubtract,
	onRemoveProduct
}) => {
	const [count, setCount] = useState<number>(product.count);

	const { user } = useContext<UserContextType>(UserContext);
	const { addToCart, removeFromCart } =
		useContext<CartContextType>(CartContext);

	const addHandler = async () => {
		setCount((count) => count + 1);

		if (!user) {
			const storedCart = JSON.parse(
				localStorage.getItem("mojakumulator-cart")!
			);
			const existingProductIndex = storedCart.products.findIndex(
				(p: ShoppingCartItem) => p.id === product.id && !p.returningProduct
			);

			if (existingProductIndex > -1) {
				storedCart.products[existingProductIndex].count += 1;
			} else {
				storedCart.products.push({ ...product, count: 1 });
			}

			storedCart.sum += product.b2cPrice!;
			onCartAdd(product.b2cPrice!);
			localStorage.setItem("mojakumulator-cart", JSON.stringify(storedCart));
			return;
		}

		onCartAdd(product.price);

		await fetch(`${baseApiUrl}/api/users/cart/add/${product.id}`, {
			method: "PUT",
			headers: {
				Authorization: `bearer ${user?.token}`
			}
		});

		addToCart();
	};

	const subtractHandler = async () => {
		if (!user) {
			const storedCart = JSON.parse(
				localStorage.getItem("mojakumulator-cart")!
			);
			const existingProductIndex = storedCart.products.findIndex(
				(p: ShoppingCartItem) => p.id === product.id && !p.returningProduct
			);

			if (existingProductIndex > -1) {
				const existingProduct = storedCart.products[existingProductIndex];
				if (existingProduct.count > 1) {
					existingProduct.count -= 1;
				} else {
					storedCart.products.splice(existingProductIndex, 1);
				}
				if (existingProduct.count === 1) {
					onRemoveProduct(product.id);
				}
				storedCart.sum -= product.b2cPrice!;
				localStorage.setItem("mojakumulator-cart", JSON.stringify(storedCart));
			}

			setCount((count) => Math.max(count - 1, 0));
			onCartSubtract(product.b2cPrice!);
			removeFromCart(count);
			return;
		}

		setCount((count) => count - 1);
		onCartSubtract(product.price);
		if (count === 1) {
			onRemoveProduct(product.id);
		}

		await fetch(`${baseApiUrl}/api/users/cart/remove/${product.id}`, {
			method: "PUT",
			headers: {
				Authorization: `bearer ${user?.token}`
			}
		});

		removeFromCart(count);
	};

	const emptyHandler = async () => {
		if (!user) {
			const storedCart = JSON.parse(
				localStorage.getItem("mojakumulator-cart")!
			);
			const existingProductIndex = storedCart.products.findIndex(
				(p: ShoppingCartItem) => p.id === product.id && !p.returningProduct
			);

			if (existingProductIndex > -1) {
				const existingProduct = storedCart.products[existingProductIndex];
				storedCart.sum -= existingProduct.b2cPrice! * existingProduct.count;
				storedCart.products.splice(existingProductIndex, 1);
				localStorage.setItem("mojakumulator-cart", JSON.stringify(storedCart));
			}

			setCount(0);
			onCartSubtract(product.b2cPrice! * count);
			onRemoveProduct(product.id);
			removeFromCart(count);
			return;
		}

		setCount(0);
		onCartSubtract(product.price * count);
		removeFromCart(count);
		onRemoveProduct(product.id);

		await fetch(`${baseApiUrl}/api/users/cart/clear/${product.id}`, {
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
						<p className="price-per-product">
							{user ? product.price * count : product.b2cPrice! * count}KM
						</p>
						<img src={product.imgUrl} width="150px" className="product-image" />
					</div>
					<div className="flex-item product-info">
						<b>
							{product.name.includes("99")
								? product.name.replace("99", "1")
								: product.name.replace(/\b0+(\d+Ah)/, "$1")}
						</b>
						<div className="quantity-control">
							<RemoveIcon onClick={subtractHandler} className="hover-pointer" />
							<p>{count}</p>
							<AddIcon onClick={addHandler} className="hover-pointer" />
						</div>
					</div>
					<div className="delete-button">
						<DeleteIcon onClick={emptyHandler} className="hover-pointer" />
					</div>
				</>
			)}
		</div>
	);
};

export default CartItem;
