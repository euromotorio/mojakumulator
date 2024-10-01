import { NextFunction, Request, Response } from "express";
import { JWT_SECRET } from "./config";
import jwt from "jsonwebtoken";
import { UserInterface, User as UserModel } from "../models/user";

export const getUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const authorization = req.get("authorization");

		const token =
			authorization?.startsWith("bearer") && authorization?.split(" ")[1];

		if (!token) {
			return res.status(401).json({ message: "Nema autorizacije." });
		}

		if (!JWT_SECRET) {
			return res.status(401).json({ message: "Invalid secret." });
		}

		interface UserFromDatabase extends UserInterface {
			id: string;
		}

		const verifiedToken = jwt.verify(token, JWT_SECRET) as UserFromDatabase;

		if (!verifiedToken) {
			return res.status(400).json({ message: "Nevalidni token" });
		}

		const verifiedUser = await UserModel.findById(verifiedToken.id);

		if (!verifiedUser) {
			return res.status(401).json({ message: "Nema autorizacije." });
		}

		req.user = verifiedUser;
	} catch (error: any) {
		return res.status(500).json({ message: error.message });
	}

	next();
};

export const userIsAdmin = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const user = req.user;

	if (user?.access !== "admin") {
		return res.status(401).json({ message: "Nemate pristup." });
	}

	next();
};

export const errorHandler = (
	error: Error,
	_req: Request,
	res: Response,
	next: NextFunction
) => {
	if (error.name === "ValidationError") {
		return res.status(400).json({ message: error.message });
	}
	if (error.name === "CastError") {
		return res.status(400).json({ message: error.message });
	}
	res.status(404).json({ message: error.message });

	next(error);
};
