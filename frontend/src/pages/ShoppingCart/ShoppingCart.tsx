import { FC, useContext, useEffect, useState } from "react";
import { ShoppingCart as ShoppingCartType } from "../../util/types";
import { UserContext, UserContextType } from "../../util/context/UserContext";
import ProductSummary from "../../components/ShoppingCart/ProductSummary/ProductSummary";
import "./ShoppingCart.css";
import CheckoutForm from "../../components/ShoppingCart/CheckoutForm/CheckoutForm";
import { baseApiUrl } from "../../util/config/baseApiUrl";
import emailjs from "@emailjs/browser";
import emailjsIds from "../../util/config/emailjsIds";

const ShoppingCart: FC = () => {
	const [products, setProducts] = useState<ShoppingCartType>();

	const [checkoutData, setCheckoutData] = useState({
		name: "",
		surname: "",
		address: "",
		city: "",
		zip: "",
		phone: ""
	});

	const { user } = useContext<UserContextType>(UserContext);

	useEffect(() => {
		const fetchCart = async () => {
			const response = await fetch(`${baseApiUrl}/akus/shopping-cart`, {
				headers: {
					Authorization: `bearer ${user?.token}`
				}
			});

			const jsonData = await response.json();

			setTimeout(() => {
				setProducts(jsonData);
			}, 1000);
		};

		fetchCart();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const orderHandler = async (sum: number) => {
		const templateParams = {
			user_name: user?.name,
			products: products?.products.map((product) => ({
				product_name: product.name,
				quantity: product.count,
				price: product.price
			})),
			total_price: sum,
			name: checkoutData.name,
			surname: checkoutData.surname,
			address: checkoutData.address,
			city: checkoutData.city,
			zip: checkoutData.zip,
			phone: checkoutData.phone
		};

		emailjs
			.send(emailjsIds.serviceId, emailjsIds.templateId, templateParams, {
				publicKey: emailjsIds.publicKey
			})
			.then(
				(response) => {
					console.log("SUCCESS!", response.status, response.text);
					setCheckoutData({
						name: "",
						surname: "",
						address: "",
						city: "",
						zip: "",
						phone: ""
					});
					setProducts({ products: [], sum: 0 });
				},
				(error) => {
					console.log("FAILED...", error);
				}
			);

		await fetch(`${baseApiUrl}/users/cart/clear/all`, {
			method: "PUT",
			headers: {
				Authorization: `bearer ${user?.token}`
			}
		});
	};

	return (
		<div className="shopping-cart">
			<CheckoutForm
				checkoutData={checkoutData}
				setCheckoutData={setCheckoutData}
			/>
			<ProductSummary cart={products} onOrder={orderHandler} />
		</div>
	);
};

export default ShoppingCart;
