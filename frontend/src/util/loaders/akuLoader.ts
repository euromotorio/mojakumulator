// import { baseApiUrl } from "../config/baseApiUrl";

export const akuLoader = async ({ request }: { request: Request }) => {
	const url = new URL(request.url);
	const pathname = url.pathname;

	const brand = pathname.split("/")[1];

	const response = await fetch(`/api/akus?brand=${brand}`);

	if (!response.ok) {
		throw { message: "Failed to fetch akus.", status: 500 };
	}

	return response.json();
};
