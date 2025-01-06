import { FC, useContext, useEffect, useState } from "react";
import "./NavBar.css";
import { Link, useLocation } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {
	UserContext,
	UserContextType
} from "../../../util/context/UserContext";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import SideBar from "../SideBar/SideBar";
import { Badge } from "@mui/material";
import {
	CartContext,
	CartContextType
} from "../../../util/context/CartContext";

const NavBar: FC = () => {
	const { user } = useContext<UserContextType>(UserContext);
	const { cartCount } = useContext<CartContextType>(CartContext);

	const [openSidebar, setOpenSidebar] = useState<boolean>(false);
	const [width] = useState<number>(window.innerWidth);

	const location = useLocation();

	const isMobile = width <= 768;

	useEffect(() => {
		setOpenSidebar(false);
	}, [location.pathname]);

	useEffect(() => {
		if (isMobile) {
			setOpenSidebar(true);
		}
	}, [isMobile]);

	const sidebarOutsideClickHandler = (value: boolean) => {
		setOpenSidebar(value);
	};

	return (
		<div className="navbar">
			{openSidebar && (
				<SideBar
					opened={openSidebar}
					onClickOutside={sidebarOutsideClickHandler}
				/>
			)}
			{openSidebar ? (
				<CloseIcon
					className="burger"
					fontSize="large"
					onClick={() => setOpenSidebar((sidebarState) => !sidebarState)}
				/>
			) : (
				<MenuIcon
					className="burger"
					fontSize="large"
					onClick={() => setOpenSidebar((sidebarState) => !sidebarState)}
				/>
			)}
			<Link
				to={`/${!user && "?b2c=true"}`}
				className="navbar-link homepage-link"
			>
				MojAkumulator
			</Link>

			<div className="welcome">Dobrodošli {user?.name}</div>
			<Link to={`/korpa${!user && "?b2c=true"}`} className="navbar-link">
				<Badge badgeContent={cartCount}>
					<ShoppingCartIcon color="inherit" />
				</Badge>
			</Link>
		</div>
	);
};

export default NavBar;
