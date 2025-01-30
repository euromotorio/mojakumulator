import { FC } from "react";
import ProductGrid from "../../ProductGrid/ProductGrid";
import { PageData } from "../../../../util/types";
import "./PageSection.css";

interface PageSectionProps {
	data: PageData;
}

const PageSection: FC<PageSectionProps> = ({ data }) => {
	return (
		<div className="sub-brand-container">
			<div className="aligned-content">
				<h1 className="sub-brand-title">{data.subBrand.substring(2)}</h1>
				<ProductGrid products={data.akus} />
			</div>
		</div>
	);
};

export default PageSection;
