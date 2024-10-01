import { FC, useState } from "react";
import { User as UserInterface } from "../../util/types";
import { useLoaderData } from "react-router-dom";
import "./Users.css";
import User from "./User/User";
import NewUser from "./NewUser/NewUser";

const Users: FC = () => {
	const [users, setUsers] = useState<Array<UserInterface>>(
		useLoaderData() as Array<UserInterface>
	);

	const [isNewUser, setIsNewUser] = useState<boolean>(false);

	const newUserHandler = (user: UserInterface) => {
		setUsers((users) => [...users, user]);
		setIsNewUser(false);
	};

	const deleteHandler = (id: string) => {
		setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
	};

	return (
		<>
			<table>
				<tr>
					<th>Naziv firme</th>
				</tr>

				{users?.map(
					(user) =>
						user.access !== "admin" && (
							<tr>
								<User company={user} key={user.id} onDelete={deleteHandler} />
							</tr>
						)
				)}

				<tr>
					<td className="add-new-user" onClick={() => setIsNewUser(!isNewUser)}>
						+
					</td>
				</tr>
			</table>
			{isNewUser && (
				<NewUser
					onClickModal={() => setIsNewUser(false)}
					onAddUser={newUserHandler}
				/>
			)}
		</>
	);
};

export default Users;
