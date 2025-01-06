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
	useLocation,
	useNavigate,
	useSearchParams
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
import Varta from "./pages/Varta/Varta";
import Rombat from "./pages/Rombat/Rombat";
// import Home from "./pages/Home/Home";
import Klas from "./pages/Klas/Klas";
import { CartContext } from "./util/context/CartContext";
import { baseApiUrl } from "./util/config/baseApiUrl";
// import Klas from "./pages/Klas/Klas";

const Layout: FC = () => {
	const { login } = useContext<UserContextType>(UserContext);
	const { message } = useContext<NotificationContextType>(NotificationContext);
	// const location = useLocation();

	const redirect = useNavigate();

	const location = useLocation();

	const [searchParams] = useSearchParams();
	const isB2C = searchParams.get("b2c");

	useEffect(() => {
		const storedUser = localStorage.getItem("user");
		if (storedUser) {
			return login(JSON.parse(storedUser) as User);
		}

		if (isB2C) {
			return;
		}
		redirect("/login");
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			{location.pathname !== "/login" && <NavBar />}
			<div className="layout">
				{location.pathname !== "/login" && <SideBar />}
				<div className="notification">{message}</div>
				<div
					className={`outlet ${
						location.pathname.startsWith("/proizvodi") &&
						"outlet-single-product"
					}`}
				>
					<Outlet />
				</div>
			</div>
		</>
	);

	// useEffect(() => {
	// 	const storedUser = localStorage.getItem("user");
	// 	if (storedUser) {
	// 		return login(JSON.parse(storedUser) as User);
	// 	}
	// 	if (location.pathname === "/") {
	// 		return;
	// 	}
	// 	if (location.pathname !== "/login") {
	// 		redirect("/login");
	// 	}
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, []);

	// useEffect(() => {
	// 	const storedUser = localStorage.getItem("user");

	// 	if (!storedUser || (storedUser && location.pathname === "/login")) {
	// 		redirect("/");
	// 	}

	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [user]);

	// return (
	// 	<>
	// 		{location.pathname !== "/login" && <NavBar />}
	// 		<div className="layout">
	// 			{location.pathname !== "/login" && <SideBar />}
	// 			<div className="notification">{message}</div>
	// 			<div className="outlet">
	// 				<Outlet />
	// 			</div>
	// 		</div>
	// 	</>
	// );
};

const ErrorBoundary: FC = () => {
	const [searchParams] = useSearchParams();
	const isB2C = searchParams.get("b2c");

	return (
		<div>
			<div>Došlo je do greške.</div>
			<Link to={`/${isB2C && "?b2c=true"}`}>Nazad na početnu stranicu.</Link>
		</div>
	);
};

const App: FC = () => {
	const router = createBrowserRouter(
		createRoutesFromElements(
			<Route path="/" element={<Layout />} errorElement={<ErrorBoundary />}>
				{/* <Route path="/" element={<Home />} loader={akuLoader} /> */}
				<Route path="urban" element={<Urban />} loader={akuLoader} />
				<Route path="klas" element={<Klas />} loader={akuLoader} />
				<Route path="exide" element={<Exide />} loader={akuLoader} />
				<Route path="varta" element={<Varta />} loader={akuLoader} />
				<Route path="rombat" element={<Rombat />} loader={akuLoader} />
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
	const [cartCount, setCartCount] = useState<number>(0);

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

	useEffect(() => {
		const getCartCount = async () => {
			if (!user?.token) return;

			try {
				const response = await fetch(`${baseApiUrl}/api/users/cart`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `bearer ${user.token}`
					}
				});

				if (response.ok) {
					const cartItemCount = await response.json();
					setCartCount(cartItemCount);
				} else {
					console.error(
						"Failed to fetch cart:",
						response.status,
						response.statusText
					);
				}
			} catch (error) {
				console.error("Error fetching cart:", error);
			}
		};

		getCartCount();
	}, [user]);

	const addToCartHandler = () => {
		setCartCount((prev) => prev + 1);
	};

	const removeFromCartHandler = () => {
		setCartCount((prev) => prev - 1);
	};

	const clearCartHandler = () => {
		setCartCount(0);
	};

	return (
		<UserContext.Provider
			value={{ user, login: loginHandler, logout: logoutHandler }}
		>
			<CartContext.Provider
				value={{
					cartCount,
					addToCart: addToCartHandler,
					removeFromCart: removeFromCartHandler,
					clearCart: clearCartHandler
				}}
			>
				<NotificationContext.Provider
					value={{ message, setMessage: notificationMessageHandler }}
				>
					<RouterProvider router={router} />
				</NotificationContext.Provider>
			</CartContext.Provider>
		</UserContext.Provider>
	);
};

export default App;
