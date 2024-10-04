import { FC, useContext, useEffect, useState } from "react";
import NavBar from "./components/shared/NavBar/NavBar";
import SideBar from "./components/shared/SideBar/SideBar";
import {
	createBrowserRouter,
	createRoutesFromElements,
	Link,
	Outlet,
	Route,
	RouterProvider,
	useNavigate
} from "react-router-dom";
import Urban from "./pages/Urban/Urban";
import "./App.css";
import Exide from "./pages/Exide/Exide";
import { akuLoader } from "./util/loaders/akuLoader";
import { UserContext, UserContextType } from "./util/context/UserContext";
import { User } from "./util/types";
import Login from "./pages/Login/Login";
import Users from "./pages/Users/Users";
import { userLoader } from "./util/loaders/userLoader";
import ShoppingCart from "./pages/ShoppingCart/ShoppingCart";
import {
	NotificationContext,
	NotificationContextType
} from "./util/context/NotificationContext";
import Aku from "./pages/Aku/Aku";
import { singleAkuLoader } from "./util/loaders/singleAkuLoader";

const Layout: FC = () => {
	const { user, login } = useContext<UserContextType>(UserContext);
	const { message } = useContext<NotificationContextType>(NotificationContext);

	const redirect = useNavigate();

	useEffect(() => {
		const storedUser = localStorage.getItem("user");
		if (storedUser) {
			return login(JSON.parse(storedUser) as User);
		}
		redirect("/login");
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			{user && <NavBar />}
			<div className="layout">
				{user && <SideBar />}
				<div className="notification">{message}</div>
				<div className="outlet">
					<Outlet />
				</div>
			</div>
		</>
	);
};

const ErrorBoundary: FC = () => {
	return (
		<div>
			<div>Došlo je do greške.</div>
			<Link to="/">Nazad na početnu stranicu.</Link>
		</div>
	);
};

const App: FC = () => {
	const router = createBrowserRouter(
		createRoutesFromElements(
			<Route path="/" element={<Layout />} errorElement={<ErrorBoundary />}>
				<Route path="urban" element={<Urban />} loader={akuLoader} />
				<Route path="exide" element={<Exide />} loader={akuLoader} />
				<Route path="proizvodi">
					<Route path=":productId" element={<Aku />} loader={singleAkuLoader} />
				</Route>
				<Route path="login" element={<Login />} />
				<Route path="admin">
					<Route path="korisnici" element={<Users />} loader={userLoader} />
				</Route>
				<Route path="/korpa" element={<ShoppingCart />} />
			</Route>
		)
	);

	const [user, setUser] = useState<User | undefined>();
	const [message, setMessage] = useState<string>("");

	const loginHandler = (userParam: User) => {
		setUser(userParam);
	};

	const logoutHandler = () => {
		setUser(undefined);
	};

	const notificationMessageHandler = (incomingMessage: string) => {
		setMessage(incomingMessage);

		setTimeout(() => {
			setMessage("");
		}, 2000);
	};

	return (
		<UserContext.Provider
			value={{ user, login: loginHandler, logout: logoutHandler }}
		>
			<NotificationContext.Provider
				value={{ message, setMessage: notificationMessageHandler }}
			>
				<RouterProvider router={router} />
			</NotificationContext.Provider>
		</UserContext.Provider>
	);
};

export default App;
