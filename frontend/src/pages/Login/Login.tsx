import { TextField } from "@mui/material";
import { ChangeEvent, FC, FormEvent, useContext, useState } from "react";
import "./Login.css";
import { UserContext, UserContextType } from "../../util/context/UserContext";
import { useNavigate } from "react-router-dom";
import { baseApiUrl } from "../../util/config/baseApiUrl";

const Login: FC = () => {
	const [username, setUsername] = useState<string>("");
	const [password, setPassword] = useState<string>("");

	const { login } = useContext<UserContextType>(UserContext);

	const redirect = useNavigate();

	const setUsernameHandler = (event: ChangeEvent<HTMLInputElement>) => {
		setUsername(event.target.value);
	};

	const setPasswordHandler = (event: ChangeEvent<HTMLInputElement>) => {
		setPassword(event.target.value);
	};

	const loginHandler = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const response = (
			await fetch(`${baseApiUrl}/users/login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({ username, password })
			})
		).json();

		const loginUser = await response;

		localStorage.setItem("user", JSON.stringify(loginUser));

		login(loginUser);

		redirect("/");
	};

	return (
		<div className="form-container">
			<form className="login-form" onSubmit={loginHandler}>
				<TextField
					variant="outlined"
					required
					label="Korisničko ime"
					value={username}
					onChange={setUsernameHandler}
				/>
				<TextField
					variant="outlined"
					type="password"
					required
					label="Lozinka"
					value={password}
					onChange={setPasswordHandler}
				/>
				<button>Prijava</button>
			</form>
		</div>
	);
};

export default Login;
