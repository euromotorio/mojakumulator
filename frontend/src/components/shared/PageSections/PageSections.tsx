import { FC, useEffect, useState } from "react";
import { PageData } from "../../../util/types";
import PageSection from "./PageSection/PageSection";

interface PageSectionProps {
	data: Array<PageData>;
}

const PageSections: FC<PageSectionProps> = ({ data }) => {
	const [sortedData, setSortedData] = useState<Array<PageData>>([]);

	useEffect(() => {
		if (data) {
			const sorted = [...data].sort((a, b) => {
				const numA = parseInt(a.subBrand.match(/^\d+/)?.[0] || "0", 10);
				const numB = parseInt(b.subBrand.match(/^\d+/)?.[0] || "0", 10);
				return numA - numB;
			});

			setSortedData(sorted);
		}
	}, [data]);

	return (
		<>
			{sortedData.map((item) => (
				<PageSection data={item} key={item.subBrand} />
			))}
		</>
	);
};

export default PageSections;
