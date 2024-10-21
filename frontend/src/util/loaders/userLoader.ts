// import { baseApiUrl } from "../config/baseApiUrl";

export const userLoader = async () => {
	const response = await fetch(`/api/users`);

	if (!response.ok) {
		throw { message: "Failed to fetch users.", status: 500 };
	}

	return response.json();
};
