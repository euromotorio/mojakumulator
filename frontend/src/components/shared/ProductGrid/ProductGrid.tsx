import { FC, useContext, useEffect, useState } from "react";
import { ReturningProduct, ShoppingCartItem } from "../../../util/types";
import ProductCard from "./ProductCard/ProductCard";
import "./ProductGrid.css";
import DiscountForm from "../DiscountForm/DiscountForm";
import {
	CartContext,
	CartContextType
} from "../../../util/context/CartContext";

interface ProductGridProps {
	products: Array<ShoppingCartItem>;
}

const ProductGrid: FC<ProductGridProps> = ({ products }) => {
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [selectedProductId, setSelectedProductId] = useState<string | null>(
		null
	);
	const [discountIsActive, setDiscountIsActive] = useState<boolean>(false);

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

	const modalOpenHandler = (id: string) => {
		window.scrollTo(0, 0);
		setSelectedProductId(id);
		setIsModalOpen(true);
	};

	const discountHandler = (discountedProduct: ReturningProduct) => {
		if (selectedProductId) {
			const product = products.find((p) => p.id === selectedProductId);
			if (product) {
				const discountedPrice = discountIsActive
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
		}
	};

	const discountActivationHandler = (value: boolean) => {
		setDiscountIsActive(value);
	};

	return (
		<div className="product-grid">
			{products.map((product) => (
				<ProductCard
					product={product}
					key={product.id}
					onModalOpen={modalOpenHandler}
					onMakeDiscounted={discountActivationHandler}
				/>
			))}
			{isModalOpen && (
				<DiscountForm
					onModalClick={() => setIsModalOpen(false)}
					onSubmitDiscount={discountHandler}
				/>
			)}
		</div>
	);
};

export default ProductGrid;
