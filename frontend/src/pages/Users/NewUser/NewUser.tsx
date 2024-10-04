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
	const [shippingName, setShippingName] = useState<string>();
	const [shippingAddress, setShippingAddress] = useState<string>();
	const [shippingZipCode, setShippingZipCode] = useState<string>();
	const [shippingCity, setShippingCity] = useState<string>();
	const [shippingContactPhone, setShippingContactPhone] = useState<string>();

	const saveUserHandler = async (event: FormEvent) => {
		event.preventDefault();

		const response = await fetch(`${baseApiUrl}/users/new`, {
			method: "POST",
			body: JSON.stringify({
				username,
				name,
				password,
				fullName: shippingName,
				street: shippingAddress,
				zipCode: shippingZipCode,
				city: shippingCity,
				phone: shippingContactPhone
			}),
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
				<TextField
					label="Ime i prezime"
					required
					value={shippingName}
					onChange={(event: ChangeEvent<HTMLInputElement>) =>
						setShippingName(event.target.value)
					}
				/>
				<TextField
					label="Ulica dostave"
					required
					value={shippingAddress}
					onChange={(event: ChangeEvent<HTMLInputElement>) =>
						setShippingAddress(event.target.value)
					}
				/>
				<div>
					<TextField
						label="Poštanski broj"
						required
						value={shippingZipCode}
						onChange={(event: ChangeEvent<HTMLInputElement>) =>
							setShippingZipCode(event.target.value)
						}
					/>
					<TextField
						label="Grad"
						required
						value={shippingCity}
						onChange={(event: ChangeEvent<HTMLInputElement>) =>
							setShippingCity(event.target.value)
						}
					/>
					<TextField
						label="Telefon"
						type="tel"
						required
						value={shippingContactPhone}
						onChange={(event: ChangeEvent<HTMLInputElement>) =>
							setShippingContactPhone(event.target.value)
						}
					/>
				</div>
				<button>Dodaj</button>
			</form>
		</div>
	);
};

export default NewUser;
