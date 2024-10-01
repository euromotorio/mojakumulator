import { TextField } from "@mui/material";
import {
	ChangeEvent,
	FC,
	FormEvent,
	MouseEvent,
	useContext,
	useState
} from "react";
import "./NewUser.css";
import {
	UserContext,
	UserContextType
} from "../../../util/context/UserContext";
import { User } from "../../../util/types";
import { baseApiUrl } from "../../../util/config/baseApiUrl";

interface NewUserProps {
	onClickModal: () => void;
	onAddUser: (user: User) => void;
}

const NewUser: FC<NewUserProps> = ({ onClickModal, onAddUser }) => {
	const { user } = useContext<UserContextType>(UserContext);

	const [username, setUsername] = useState<string>();
	const [name, setName] = useState<string>();
	const [password, setPassword] = useState<string>();

	const saveUserHandler = async (event: FormEvent) => {
		event.preventDefault();

		const response = await fetch(`${baseApiUrl}/users/new`, {
			method: "POST",
			body: JSON.stringify({ username, name, password }),
			headers: {
				"Content-Type": "application/json",
				Authorization: `bearer ${user?.token}`
			}
		});

		const newUser = await response.json();
		onAddUser(newUser);
	};

	const closeModalHandler = () => {
		onClickModal();
	};

	return (
		<div className="new-user-form-container" onClick={closeModalHandler}>
			<form
				className="new-user-form"
				onClick={(event: MouseEvent) => event.stopPropagation()}
				onSubmit={saveUserHandler}
			>
				<div>
					<TextField
						label="Naziv firme"
						required
						value={name}
						onChange={(event: ChangeEvent<HTMLInputElement>) =>
							setName(event.target.value)
						}
					/>
					<TextField
						label="Korisnicko ime"
						required
						value={username}
						onChange={(event: ChangeEvent<HTMLInputElement>) =>
							setUsername(event.target.value)
						}
					/>
					<TextField
						label="Lozinka"
						required
						value={password}
						onChange={(event: ChangeEvent<HTMLInputElement>) =>
							setPassword(event.target.value)
						}
					/>
				</div>
				<button>Dodaj</button>
			</form>
		</div>
	);
};

export default NewUser;
