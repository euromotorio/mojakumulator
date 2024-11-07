import { FC, useState } from "react";
import { PageData } from "../../util/types";
import { useLoaderData } from "react-router-dom";
import PageSections from "../../components/shared/PageSections/PageSections";

const Exide: FC = () => {
	const [data] = useState<Array<PageData>>(useLoaderData() as Array<PageData>);

	return <PageSections data={data} />;
};

export default Exide;
