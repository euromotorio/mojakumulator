import { Request, Response, Router } from "express";
import { Aku, AkuInterface } from "../models/aku";
import { getUser } from "../util/middleware";
import { CartItem } from "../util/types";
import { ObjectId } from "mongoose";

const router = Router();

interface GetAllQuery {
	brand: "exide" | "urban";
}

router.get(
	"/",
	async (req: Request<{}, {}, {}, GetAllQuery>, res: Response) => {
		const brand = req.query.brand;

		try {
			const akus = await Aku.find({
				brand: { $regex: brand, $options: "i" }
			}).sort({ name: 1 });

			const transformedData = akus.reduce(
				(
					result: Array<{ subBrand: string; akus: Array<AkuInterface> }>,
					aku
				) => {
					const existingSubBrand = result.find(
						(item) => item.subBrand === aku.subBrand
					);

					if (existingSubBrand) {
						existingSubBrand.akus.push(aku);
					} else {
						result.push({
							subBrand: aku.subBrand,
							akus: [aku]
						});
					}

					return result;
				},
				[]
			);

			console.log(transformedData);

			return res.status(200).json(transformedData);
		} catch (err: any) {
			res.status(500).json({ message: err.message });
		}
	}
);

router.get("/shopping-cart", getUser, async (req: Request, res: Response) => {
	const user = req.user!;

	const cart = (await user.populate("shoppingCart"))
		.shoppingCart as Array<AkuInterface>;

	try {
		const groupedCart = cart.reduce((acc: Array<CartItem>, item) => {
			const existingItem = acc.find((i) => i.id === item._id);
			if (existingItem) {
				existingItem.count += 1;
			} else {
				acc.push({
					id: item._id as ObjectId,
					count: 1,
					name: item.name,
					brand: item.brand,
					price: item.price,
					imgUrl: item.imgUrl,
					warranty: item.warranty,
					dimensions: item.dimensions,
					code: item.code,
					inStock: item.inStock,
					subBrand: item.subBrand
				});
			}
			return acc;
		}, []);

		const cartSum = cart.reduce((acc: number, currentItem) => {
			return (acc += currentItem.price);
		}, 0);

		res.status(200).json({ products: groupedCart, sum: cartSum });
	} catch (err: any) {
		res.status(500).json({ message: err.message });
	}
});

router.get(
	"/:productId",
	async (req: Request<{ productId: string }>, res: Response) => {
		try {
			const aku = await Aku.findById(req.params.productId);

			return res.status(200).json(aku);
		} catch (err: any) {
			res.status(500).json({ message: err.message });
		}
	}
);

export default router;
