import { FC, useContext, useEffect, useState } from "react";
import "./NavBar.css";
import { Link } from "react-router-dom";
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

	const isMobile = width <= 768;

	useEffect(() => {
		if (isMobile) {
			setOpenSidebar(true);
		}
	}, [isMobile]);

	return (
		<div className="navbar">
			{openSidebar && <SideBar opened={openSidebar} />}
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
			<Link to="/" className="navbar-link homepage-link">
				MojAkumulator
			</Link>
			{user && (
				<>
					<div className="welcome">Dobrodošli, {user?.name}</div>
					<Link to="/korpa" className="navbar-link">
						<Badge badgeContent={cartCount}>
							<ShoppingCartIcon color="inherit" />
						</Badge>
					</Link>
				</>
			)}
		</div>
	);
};

export default NavBar;
