import { FC } from "react";
import { Product } from "../../../util/types";
import ProductCard from "./ProductCard/ProductCard";
import "./ProductGrid.css";

interface ProductGridProps {
	products: Array<Product>;
}

const ProductGrid: FC<ProductGridProps> = ({ products }) => {
	return (
		<div className="product-grid">
			{products.map((product) => (
				<ProductCard product={product} key={product.id} />
			))}
		</div>
	);
};

export default ProductGrid;
