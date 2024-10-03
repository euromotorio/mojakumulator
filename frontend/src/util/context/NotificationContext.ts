import React from "react";

export interface NotificationContextType {
	message: string;
	setMessage: (message: string) => void;
}

export const NotificationContext = React.createContext<NotificationContextType>(
	{
		message: "",
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		setMessage: (_message: string) => {}
	}
);
