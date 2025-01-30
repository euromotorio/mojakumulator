import { FC } from "react";
import "./HomeItem.css";
import { Product } from "../../../util/types";

interface HomeItemProps {
	aku: Product;
}

const HomeItem: FC<HomeItemProps> = ({ aku }) => {
	return (
		<div className="home-item">
			<div className="home-item-image-container">
				<img src={aku.imgUrl} width={150} height={80} />
			</div>
			<div>
				<h3>
					{aku.name.includes("09")
						? aku.name.replace("0", "")
						: aku.name.replace("99", "1")}
				</h3>
			</div>
			<div>
				<p>Dimenzije: {aku.dimensions}</p>
				<p>Garancija: {aku.warranty} mjeseca</p>
			</div>
		</div>
	);
};

export default HomeItem;
