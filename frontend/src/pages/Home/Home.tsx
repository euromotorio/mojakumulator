import { FC, useState } from "react";
import { Product } from "../../util/types";
import { useLoaderData } from "react-router-dom";
import HomeItem from "../../components/Home/HomeItem/HomeItem";

const Home: FC = () => {
	const [data] = useState<Array<Product>>(useLoaderData() as Array<Product>);

	return data.map((aku) => <HomeItem aku={aku} key={aku.id} />);
};

export default Home;
