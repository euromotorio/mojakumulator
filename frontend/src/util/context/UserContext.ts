import React from "react";
import { User } from "../types";

export interface UserContextType {
	user: User | undefined;
	login: (user: User) => void;
	logout: () => void;
}

export const UserContext = React.createContext<UserContextType>({
	user: {
		id: "",
		name: "",
		token: "",
		access: ""
	},
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	login: (_user: User) => {},
	logout: () => {}
});
