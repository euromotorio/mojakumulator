import { FC, useContext, useEffect, useState } from "react";
import { ShoppingCart as ShoppingCartType } from "../../util/types";
import { UserContext, UserContextType } from "../../util/context/UserContext";
import ProductSummary from "../../components/ShoppingCart/ProductSummary/ProductSummary";
import "./ShoppingCart.css";
import { baseApiUrl } from "../../util/config/baseApiUrl";
import emailjs from "@emailjs/browser";
import emailjsIds from "../../util/config/emailjsIds";
import CheckoutForm, {
	CheckoutData as CheckoutDataType
} from "../../components/ShoppingCart/CheckoutForm/CheckoutForm";
import { CartContext, CartContextType } from "../../util/context/CartContext";

const ShoppingCart: FC = () => {
	const [products, setProducts] = useState<ShoppingCartType>();
	const [checkoutReady, setCheckoutReady] = useState<boolean>(false);
	const [checkoutDataB2C, setCheckoutDataB2C] = useState<CheckoutDataType>();
	const [formResetKey, setFormResetKey] = useState<number>(0);

	const { user } = useContext<UserContextType>(UserContext);
	const { cartCount, removeFromCart } =
		useContext<CartContextType>(CartContext);

	useEffect(() => {
		const fetchCart = async () => {
			if (!user) {
				const storedCart = localStorage.getItem("mojakumulator-cart");
				if (!storedCart) {
					const initialCart = { products: [], sum: 0 };
					localStorage.setItem(
						"mojakumulator-cart",
						JSON.stringify(initialCart)
					);
					setProducts(initialCart);
					return;
				}

				const cart = JSON.parse(storedCart);
				setTimeout(() => {
					setProducts(cart);
				}, 1000);

				return;
			}

			const userToken = JSON.parse(localStorage.getItem("user")!).token;

			const response = await fetch(`${baseApiUrl}/api/akus/shopping-cart`, {
				headers: {
					Authorization: `bearer ${userToken}`
				}
			});

			if (!response.ok) {
				return setProducts({ products: [], sum: 0 });
			}

			const jsonData = await response.json();

			setTimeout(() => {
				setProducts(jsonData);
			}, 1000);
		};

		fetchCart();
	}, [user]);

	const checkoutReadyHandler = (value: boolean) => {
		setCheckoutReady(value);
	};

	const orderHandler = async (sum: number) => {
		if (!user) {
			const templateParams = {
				user_name: "Nema naloga",
				products: products?.products.map((product) => ({
					product_name: product.name,
					quantity: product.count,
					price: product.b2cPrice,
					code: product.b2cCode,
					returning_product: product.returningProduct || null
				})),
				total_price: sum,
				name: checkoutDataB2C!.name,
				surname: checkoutDataB2C!.surname,
				address: checkoutDataB2C!.street,
				city: checkoutDataB2C!.city,
				zip: checkoutDataB2C!.zipCode,
				phone: checkoutDataB2C!.phone
			};

			emailjs
				.send(emailjsIds.serviceId, emailjsIds.templateId, templateParams, {
					publicKey: emailjsIds.publicKey
				})
				.then(
					() => {
						setProducts({ products: [], sum: 0 });
					},
					(error) => {
						console.log("FAILED...", error);
					}
				);

			setFormResetKey((prevKey) => prevKey + 1);

			localStorage.removeItem("mojakumulator-cart");

			setCheckoutDataB2C({
				name: "",
				surname: "",
				city: "",
				phone: "",
				street: "",
				zipCode: ""
			});

			removeFromCart(cartCount);

			return;
		}

		const userToken = JSON.parse(localStorage.getItem("user")!).token;

		const response = await fetch(`${baseApiUrl}/api/users/address`, {
			headers: {
				Authorization: `bearer ${userToken}`
			}
		});

		const checkoutData = await response.json();

		const templateParams = {
			user_name: user?.name,
			products: products?.products.map((product) => ({
				product_name: product.name,
				quantity: product.count,
				price: product.price,
				code: product.code
			})),
			total_price: sum,
			name: checkoutData.shippingName[0],
			surname: checkoutData.shippingName[1],
			address: checkoutData.address.street,
			city: checkoutData.address.city,
			zip: checkoutData.address.zipCode,
			phone: checkoutData.phone
		};

		emailjs
			.send(emailjsIds.serviceId, emailjsIds.templateId, templateParams, {
				publicKey: emailjsIds.publicKey
			})
			.then(
				() => {
					setProducts({ products: [], sum: 0 });
				},
				(error) => {
					console.log("FAILED...", error);
				}
			);

		await fetch(`${baseApiUrl}/api/users/cart/clear/all`, {
			method: "PUT",
			headers: {
				Authorization: `bearer ${userToken}`
			}
		});
	};

	const removeProductFromCart = (productId: string) => {
		setProducts((prevState) => {
			if (!prevState) return prevState;

			const updatedProducts = prevState.products.filter(
				(product) => product.id !== productId
			);
			const updatedSum = updatedProducts.reduce(
				(sum, product) =>
					sum + (user ? product.price : product.b2cPrice!) * product.count,
				0
			);

			return { ...prevState, products: updatedProducts, sum: updatedSum };
		});
	};

	return (
		<div className="shopping-cart">
			{!user && (
				<CheckoutForm
					key={formResetKey}
					onCheckoutReady={checkoutReadyHandler}
					onCheckoutChange={(value: CheckoutDataType) =>
						setCheckoutDataB2C(value)
					}
				/>
			)}
			<ProductSummary
				cart={products}
				onOrder={orderHandler}
				onRemoveProduct={removeProductFromCart}
				cartReady={checkoutReady}
			/>
		</div>
	);
};

export default ShoppingCart;
