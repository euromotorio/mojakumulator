import { FC, useContext, useEffect, useRef } from "react";
import "./SideBar.css";
import CustomLink from "../CustomLink/CustomLink";
import { Link } from "react-router-dom";
import {
	UserContext,
	UserContextType
} from "../../../util/context/UserContext";

interface SideBarProps {
	opened?: boolean;
	onClickOutside?: (value: boolean) => void;
}

const SideBar: FC<SideBarProps> = ({ opened, onClickOutside }) => {
	const { user, logout } = useContext<UserContextType>(UserContext);

	const sidebarRef = useRef<HTMLDivElement>(null);

	const logoutHandler = () => {
		localStorage.removeItem("user");
		logout();
	};

	const handleClickOutside = (event: MouseEvent) => {
		if (
			sidebarRef.current &&
			!sidebarRef.current.contains(event.target as Node)
		) {
			onClickOutside?.(false);
		}
	};

	useEffect(() => {
		if (opened) {
			document.addEventListener("mousedown", handleClickOutside);
		} else {
			document.removeEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [opened]);

	return (
		<div className={`sidebar ${opened && "opened-sidebar"}`} ref={sidebarRef}>
			<div className="sidebar-header">
				{user && (
					<>
						<CustomLink location="/urban" text="Urban" />
						<CustomLink location="/klas" text="Klas" />
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
				{/* {!user && <Link to="/login">B2B</Link>} */}
				{user && (
					<Link to="/login" onClick={logoutHandler}>
						Odjava
					</Link>
				)}
			</div>
		</div>
	);
};

export default SideBar;
