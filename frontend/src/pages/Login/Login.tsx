import { TextField } from "@mui/material";
import { ChangeEvent, FC, FormEvent, useContext, useState } from "react";
import "./Login.css";
import { UserContext, UserContextType } from "../../util/context/UserContext";
import { baseApiUrl } from "../../util/config/baseApiUrl";
import { useNavigate } from "react-router-dom";

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

		try {
			const response = await fetch(`${baseApiUrl}/api/users/login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({ username, password })
			});

			if (!response.ok) {
				return;
			}

			const loginUser = await response.json();

			localStorage.setItem("user", JSON.stringify(loginUser));

			login(loginUser);

			redirect("/");
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="form-container">
			{/* <div className="form-tooltip">
				<p>Dobrodošli u naš B2B sistem.</p>
				<p>
					Ukoliko želite da postanete naš saradnik i partner u biznisu
					garantujemo najbolje cijene u BiH, kvalitet proizvoda i brzu isporuku.
				</p>
				<p>
					Dobiti ćete reklamni prostor na našoj web i Facebook stranici, te ćemo
					vas kroz naš marketing "gurati" ka uspjehu.
				</p>
				<p>
					Mi gradimo zdravu zajednicu ka velikoj budućnosti! Budite i vi dio
					novog pokreta u biznisu i unaprijedite vase poslovanje.
				</p>
			</div> */}
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
