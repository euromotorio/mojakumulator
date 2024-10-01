import { TextField } from "@mui/material";
import { ChangeEvent, FC } from "react";
import "./CheckoutForm.css";

interface CheckoutData {
	name: string;
	surname: string;
	address: string;
	city: string;
	zip: string;
	phone: string;
}

interface CheckoutFormProps {
	checkoutData: CheckoutData;
	setCheckoutData: (
		value: CheckoutData | ((prevState: CheckoutData) => CheckoutData)
	) => void;
}

const CheckoutForm: FC<CheckoutFormProps> = ({
	checkoutData,
	setCheckoutData
}) => {
	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setCheckoutData((prevState: CheckoutData) => ({
			...prevState,
			[name]: value
		}));
	};

	return (
		<form className="checkout-form">
			<div>
				<h2>Detalji za dostavu</h2>
				<hr />
			</div>
			<div className="input-fields">
				<div className="name">
					<TextField
						label="Ime"
						required
						value={checkoutData.name}
						name="name"
						onChange={handleChange}
					/>
					<TextField
						label="Prezime"
						required
						value={checkoutData.surname}
						name="surname"
						onChange={handleChange}
					/>
				</div>
				<TextField
					label="Ulica i broj"
					required
					value={checkoutData.address}
					name="address"
					onChange={handleChange}
				/>
				<div className="">
					<TextField
						label="Grad"
						required
						value={checkoutData.city}
						name="city"
						onChange={handleChange}
					/>
					<TextField
						label="Poštanski broj"
						required
						type="number"
						value={checkoutData.zip}
						name="zip"
						onChange={handleChange}
					/>
					<TextField
						label="Kontakt telefon"
						required
						type="tel"
						value={checkoutData.phone}
						name="phone"
						onChange={handleChange}
					/>
				</div>
			</div>
		</form>
	);
};

export default CheckoutForm;
