import { FC, useContext } from "react";
import "./SideBar.css";
import CustomLink from "../CustomLink/CustomLink";
import { Link } from "react-router-dom";
import {
	UserContext,
	UserContextType
} from "../../../util/context/UserContext";

interface SideBarProps {
	opened?: boolean;
}

const SideBar: FC<SideBarProps> = ({ opened }) => {
	const { user, logout } = useContext<UserContextType>(UserContext);

	const logoutHandler = () => {
		localStorage.removeItem("user");
		logout();
	};

	return (
		<div className={`sidebar ${opened && "opened-sidebar"}`}>
			<div className="sidebar-header">
				{user && (
					<>
						<CustomLink location="/urban" text="Urban" />
						<CustomLink location="/exide" text="Exide" />
						<CustomLink location="/rombat" text="Rombat" />
						<CustomLink location="/varta" text="Varta" />
					</>
				)}
			</div>
			<div className="sidebar-footer">
				{user?.access === "admin" && (
					<Link to="/admin/korisnici">Korisnici</Link>
				)}
				{!user && <Link to="/login">B2B</Link>}
				{user && (
					<Link to="/" onClick={logoutHandler}>
						Odjava
					</Link>
				)}
			</div>
		</div>
	);
};

export default SideBar;
