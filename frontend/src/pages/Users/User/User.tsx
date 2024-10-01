import { FC, useContext } from "react";
import "./User.css";
import { User as UserInterface } from "../../../util/types";
import DeleteIcon from "@mui/icons-material/Delete";
import {
	UserContext,
	UserContextType
} from "../../../util/context/UserContext";
import { baseApiUrl } from "../../../util/config/baseApiUrl";

interface UserItemProps {
	company: UserInterface;
	onDelete: (id: string) => void;
}

const User: FC<UserItemProps> = ({ company, onDelete }) => {
	const { user } = useContext<UserContextType>(UserContext);

	const deleteHandler = async () => {
		if (window.confirm("Da li ste sigurni?")) {
			await fetch(`${baseApiUrl}/users/${company.id}`, {
				headers: {
					Authorization: `bearer ${user?.token}`
				},
				method: "DELETE"
			});
		}

		onDelete(company.id);
	};

	return (
		<>
			<td>{company.name}</td>
			<td className="delete delete-icon" onClick={deleteHandler}>
				<DeleteIcon />
			</td>
		</>
	);
};

export default User;
