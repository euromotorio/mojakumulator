import { FC } from "react";
import { NavLink } from "react-router-dom";
import "./CustomLink.css";

interface CustomLinkProps {
	location: string;
	text: string;
}

const CustomLink: FC<CustomLinkProps> = ({ location, text }) => {
	return (
		<NavLink to={location} className="link">
			{text}
		</NavLink>
	);
};

export default CustomLink;
