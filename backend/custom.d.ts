import { UserInterface } from "./models/user";

declare global {
	namespace Express {
		interface Request {
			user?: UserInterface;
		}
	}
}
