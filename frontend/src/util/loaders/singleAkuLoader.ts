import { Params } from "react-router-dom";
import { baseApiUrl } from "../config/baseApiUrl";

export const singleAkuLoader = async ({
	params
}: {
	params: Params<"productId">;
}) => {
	const id = params.productId;

	const response = await fetch(`${baseApiUrl}/api/akus/${id}`);

	if (!response.ok) {
		throw { message: "Failed to fetch akus.", status: 500 };
	}

	return response.json();
};
