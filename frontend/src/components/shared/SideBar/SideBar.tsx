import { FC, useContext } from "react";
import "./SideBar.css";
import CustomLink from "../CustomLink/CustomLink";
import { Link } from "react-router-dom";
import {
	UserContext,
	UserContextType
} from "../../../util/context/UserContext";

const SideBar: FC = () => {
	const { user, logout } = useContext<UserContextType>(UserContext);

	const logoutHandler = () => {
		localStorage.removeItem("user");
		logout();
	};

	return (
		<div className="sidebar">
			<div className="sidebar-header">
				<CustomLink location="/urban" text="Urban" />
				<CustomLink location="/exide" text="Exide" />
			</div>
			<div className="sidebar-footer">
				{user?.access === "admin" && (
					<Link to="/admin/korisnici">Korisnici</Link>
				)}
				<Link to="/login" onClick={logoutHandler}>
					Odjava
				</Link>
			</div>
		</div>
	);
};

export default SideBar;
