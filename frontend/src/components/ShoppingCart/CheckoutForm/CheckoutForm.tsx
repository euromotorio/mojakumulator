import { TextField } from "@mui/material";
import { ChangeEvent, FC, useEffect, useState } from "react";

import "./CheckoutForm.css";

export interface CheckoutData {
	name: string;
	surname: string;
	street: string;
	city: string;
	zipCode: string;
	phone: string;
}

interface CheckoutFormProps {
	onCheckoutReady: (value: boolean) => void;
	onCheckoutChange: (value: CheckoutData) => void;
}

const CheckoutForm: FC<CheckoutFormProps> = ({
	onCheckoutReady,
	onCheckoutChange
}) => {
	const [name, setName] = useState<string>("");
	const [surname, setSurname] = useState<string>("");
	const [street, setStreet] = useState<string>("");
	const [city, setCity] = useState<string>("");
	const [zipCode, setZipCode] = useState<string>("");
	const [phone, setPhone] = useState<string>("");

	useEffect(() => {
		onCheckoutChange({ name, surname, street, city, zipCode, phone });

		if (name && surname && street && city && zipCode && phone) {
			return onCheckoutReady(true);
		}

		onCheckoutReady(false);
	}, [
		name,
		surname,
		street,
		city,
		zipCode,
		phone,
		onCheckoutReady,
		onCheckoutChange
	]);

	return (
		<div className="checkout-form">
			<h2>Unesti podatke za dostavu</h2>
			<div className="checkout-text-fields">
				<div>
					<TextField
						label="Ime"
						required
						value={name}
						onChange={(event: ChangeEvent<HTMLInputElement>) =>
							setName(event.target.value)
						}
					/>
					<TextField
						label="Prezime"
						required
						value={surname}
						onChange={(event: ChangeEvent<HTMLInputElement>) =>
							setSurname(event.target.value)
						}
					/>
				</div>
				<div>
					<TextField
						label="Ulica"
						required
						value={street}
						onChange={(event: ChangeEvent<HTMLInputElement>) =>
							setStreet(event.target.value)
						}
					/>
					<TextField
						label="Grad"
						required
						value={city}
						onChange={(event: ChangeEvent<HTMLInputElement>) =>
							setCity(event.target.value)
						}
					/>
					<TextField
						label="Poštanski broj"
						required
						value={zipCode}
						onChange={(event: ChangeEvent<HTMLInputElement>) =>
							setZipCode(event.target.value)
						}
					/>
				</div>
				<TextField
					label="Broj mobitela"
					required
					value={phone}
					onChange={(event: ChangeEvent<HTMLInputElement>) =>
						setPhone(event.target.value)
					}
				/>
			</div>
		</div>
	);
};

export default CheckoutForm;
