import { FC, MouseEvent, useContext, useEffect, useState } from "react";
import "./Aku.css";
import {
	ReturningProduct,
	ShoppingCart,
	ShoppingCartItem
} from "../../util/types";
import { useLoaderData } from "react-router-dom";
import { baseApiUrl } from "../../util/config/baseApiUrl";
import { UserContext, UserContextType } from "../../util/context/UserContext";
import { CircularProgress, Tooltip } from "@mui/material";
import { CartContext, CartContextType } from "../../util/context/CartContext";
import DiscountForm from "../../components/shared/DiscountForm/DiscountForm";

const Aku: FC = () => {
	const [clicked, setClicked] = useState<boolean>(false);
	const [aku] = useState<ShoppingCartItem>(useLoaderData() as ShoppingCartItem);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [isDiscounted, setIsDiscounted] = useState<boolean>(false);
	const [productPrice, setProductPrice] = useState<number>(aku.b2cPrice!);

	const { user } = useContext<UserContextType>(UserContext);
	const { addToCart } = useContext<CartContextType>(CartContext);

	useEffect(() => {
		if (isModalOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}

		return () => {
			document.body.style.overflow = "";
		};
	}, [isModalOpen]);

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

	const discountHandler = (discountedProduct: ReturningProduct) => {
		const product = aku;
		if (product) {
			const discountedPrice = isDiscounted
				? product.b2cPrice! * 0.9
				: product.b2cPrice;

			const storedCart = JSON.parse(
				localStorage.getItem("mojakumulator-cart") ||
					'{"products": [], "sum": 0}'
			);

			const updatedCart = {
				...storedCart,
				products: [
					...storedCart.products,
					{
						id: product.id,
						name: product.name,
						price: product.price,
						count: 1,
						returningProduct: discountedProduct,
						imgUrl: product.imgUrl,
						b2cPrice: discountedPrice,
						brand: product.brand,
						dimensions: product.dimensions,
						warranty: product.warranty,
						code: product.code,
						inStock: product.inStock,
						subBrand: product.subBrand
					}
				],
				sum: storedCart.sum + discountedPrice
			};

			localStorage.setItem("mojakumulator-cart", JSON.stringify(updatedCart));

			addToCart();

			setIsModalOpen(false);
		}
	};

	const modalOpenHandler = (event: MouseEvent) => {
		event.preventDefault();
		setIsDiscounted(false);
		setIsModalOpen(true);
	};

	const realDiscountHandler = (event: MouseEvent) => {
		event.preventDefault();
		modalOpenHandler(event);
		setIsDiscounted(true);
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
						<b>Garancija: </b> {aku.warranty}{" "}
						{aku.warranty === 24 ? "mjeseca" : "mjeseci"}
					</h3>
				</div>
				<div className="product-price">
					<h2>{user ? aku.price.toFixed(2) : productPrice.toFixed(2)}KM</h2>
					<button
						onClick={user ? addToCartHandler : modalOpenHandler}
						disabled={clicked || !aku.inStock}
						className={`${clicked && "clicked"} ${
							!aku.inStock && "not-in-stock"
						}`}
					>
						{!aku.inStock && user ? (
							"Nema na stanju"
						) : clicked ? (
							<CircularProgress size="1.3em" />
						) : (
							"Dodaj u korpu"
						)}
					</button>
					{!user && (
						<Tooltip title="Ostvarite popust od 10% uz povratak starog akumulatora">
							<button
								onMouseEnter={() => setProductPrice(aku.b2cPrice! * 0.9)}
								onMouseLeave={() => setProductPrice(aku.b2cPrice!)}
								onClick={realDiscountHandler}
								className={`${clicked && "clicked"} ${
									!aku.inStock && "not-in-stock"
								}`}
							>
								{!aku.inStock && user
									? "Nema na stanju"
									: "Kupi uz povrat starog akumulatora"}
							</button>
						</Tooltip>
					)}
				</div>
			</div>
			{isModalOpen && (
				<DiscountForm
					onModalClick={() => setIsModalOpen(false)}
					onSubmitDiscount={discountHandler}
				/>
			)}
		</div>
	);
};

export default Aku;
