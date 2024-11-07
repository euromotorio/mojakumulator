import { FC } from "react";
import { PageData } from "../../../util/types";
import PageSection from "./PageSection/PageSection";

interface PageSectionProps {
	data: Array<PageData>;
}

const PageSections: FC<PageSectionProps> = ({ data }) => {
	return (
		<>
			{data.map((item) => (
				<PageSection data={item} key={item.subBrand} />
			))}
		</>
	);
};

export default PageSections;
