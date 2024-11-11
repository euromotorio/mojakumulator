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

const NavBar: FC = () => {
	const { user } = useContext<UserContextType>(UserContext);

	const [openSidebar, setOpenSidebar] = useState<boolean>(false);

	const location = useLocation();

	useEffect(() => {
		setOpenSidebar(false);
	}, [location]);

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
						<ShoppingCartIcon color="inherit" />
					</Link>
				</>
			)}
		</div>
	);
};

export default NavBar;
