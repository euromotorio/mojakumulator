import { Request, response, Response, Router } from "express";
import bcrypt from "bcrypt";
import { User } from "../models/user";
import jwt, { Secret } from "jsonwebtoken";
import { JWT_SECRET } from "../util/config";
import { getUser, userIsAdmin } from "../util/middleware";
import { Aku } from "../models/aku";

const router = Router();

router.post(
	"/login",
	async (
		req: Request<{}, {}, { username: string; password: string }>,
		res: Response
	) => {
		try {
			const user = await User.findOne({ username: req.body.username });

			if (!user) {
				throw { message: "Korisnik nije pronaden", status: 404 };
			}

			const passwordIsCorrect = await bcrypt.compare(
				req.body.password,
				user.password
			);

			if (!passwordIsCorrect) {
				throw { message: "Pogresna lozinka", status: 400 };
			}

			const token = jwt.sign({ id: user._id }, JWT_SECRET as Secret);

			res
				.status(200)
				.json({ id: user.id, name: user.name, access: user.access, token });
		} catch (err: any) {
			res.status(400).json({ message: err.message });
		}
	}
);

router.post(
	"/new",
	[getUser, userIsAdmin],
	async (
		req: Request<
			{},
			{},
			{
				username: string;
				password: string;
				name: string;
				fullName: string;
				street: string;
				zipCode: string;
				city: string;
				phone: number;
			}
		>,
		res: Response
	) => {
		try {
			const hashedPassword = await bcrypt.hash(req.body.password, 10);
			const newUser = await User.create({
				username: req.body.username,
				password: hashedPassword,
				name: req.body.name,
				fullName: req.body.fullName,
				address: {
					street: req.body.street,
					zipCode: req.body.zipCode,
					city: req.body.city
				},
				access: "user",
				shoppingCart: [],
				phone: req.body.phone
			});

			res.status(200).json(newUser);
		} catch (err: any) {
			res.status(500).json({ message: err.message });
		}
	}
);

router.get("/address", getUser, (req: Request, res: Response) => {
	const user = req.user!;

	res.status(200).json({
		shippingName: user.fullName,
		address: user.address,
		phone: user.phone
	});
});

router.get("/", async (req: Request, res: Response) => {
	try {
		const users = await User.find();
		res.status(200).json(users);
	} catch (err: any) {
		res.status(500).json({ message: err.message });
	}
});

router.delete(
	"/:id",
	[getUser, userIsAdmin],
	async (req: Request<{ id: string }>, res: Response) => {
		try {
			await User.findOneAndDelete({ _id: req.params.id });

			res.status(200).json({ message: "Pristup firme uspjesno uklonjen." });
		} catch (err: any) {
			res.status(err.statys).json({ message: err.message });
		}
	}
);

router.get("/cart", [getUser], async (req: Request, res: Response) => {
	const currentUser = req.user;

	return res.json(currentUser?.shoppingCart.length);
});

router.put(
	"/cart/add/:productId",
	getUser,
	async (req: Request<{ productId: string }>, res: Response) => {
		const user = req.user!;
		try {
			const product = await Aku.findById(req.params.productId);

			if (!product) {
				return res.status(404).json({ message: "Akumulator nije pronaden" });
			}

			user.shoppingCart = user?.shoppingCart.concat(product.id);
			await user.save();
			res.status(200).json({ message: "Proizvod uspjesno dodan u korpu" });
		} catch (err: any) {
			res.status(500).json({ message: err.message });
		}
	}
);

router.put(
	"/cart/remove/:productId",
	getUser,
	async (req: Request<{ productId: string }>, res: Response) => {
		const user = req.user!;
		try {
			const product = await Aku.findById(req.params.productId);

			if (!product) {
				return res.status(404).json({ message: "Akumulator nije pronaden" });
			}

			const indexToRemove = user.shoppingCart.findIndex(
				(aku) => aku._id.toString() === product.id
			);

			if (indexToRemove !== -1) {
				user.shoppingCart.splice(indexToRemove, 1);
				await user.save();
				return res
					.status(200)
					.json({ message: "Product removed from shopping cart." });
			} else {
				return res
					.status(404)
					.json({ message: "Product not found in shopping cart." });
			}
		} catch (err: any) {
			res.status(500).json({ message: err.message });
		}
	}
);

router.put(
	"/cart/clear/:productId",
	getUser,
	async (req: Request<{ productId: string }>, res: Response) => {
		const user = req.user!;

		if (req.params.productId === "all") {
			user.shoppingCart = [];
			await user.save();
			return res.status(200).json({ message: "Narudzba uspjesno izvrsena" });
		}

		try {
			const product = await Aku.findById(req.params.productId);

			if (!product) {
				return res.status(404).json({ message: "Akumulator nije pronaden" });
			}

			user.shoppingCart = user.shoppingCart.filter(
				(aku) => aku._id.toString() !== product.id
			);
			await user.save();
		} catch (err: any) {
			return res.status(500).json({ mesage: err.message });
		}
	}
);

export default router;
