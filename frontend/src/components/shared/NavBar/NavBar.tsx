import { FC, useContext } from "react";
import "./NavBar.css";
import { Link } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {
	UserContext,
	UserContextType
} from "../../../util/context/UserContext";

const NavBar: FC = () => {
	const { user } = useContext<UserContextType>(UserContext);

	return (
		<div className="navbar">
			<Link to="/" className="navbar-link">
				MojAkumulator
			</Link>
			<div>Dobrodošli, {user?.name}</div>
			<Link to="/korpa" className="navbar-link">
				<ShoppingCartIcon color="inherit" />
			</Link>
		</div>
	);
};

export default NavBar;
