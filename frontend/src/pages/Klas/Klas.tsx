import { FC, useState } from "react";
import { Product } from "../../util/types";
import { useLoaderData } from "react-router-dom";
import ProductGrid from "../../components/shared/ProductGrid/ProductGrid";

const Klas: FC = () => {
	const [products] = useState<Array<Product>>(
		useLoaderData() as Array<Product>
	);

	return <ProductGrid products={products} />;
};

export default Klas;
