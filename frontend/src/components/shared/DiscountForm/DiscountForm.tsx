import { ChangeEvent, FC, FormEvent, MouseEvent, useState } from "react";

import "./DiscountForm.css";
import {
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
	TextField
} from "@mui/material";
import { ReturningProduct } from "../../../util/types";

interface DiscountFormProps {
	onModalClick: () => void;
	onSubmitDiscount: (info: ReturningProduct) => void;
}

const DiscountForm: FC<DiscountFormProps> = ({
	onModalClick,
	onSubmitDiscount
}) => {
	const clickModalHandler = () => {
		onModalClick();
	};

	const [startStop, setStartStop] = useState<string>("");
	const [carBrand, setCarBrand] = useState<string>("");
	const [productionYear, setProductionYear] = useState<number>();
	const [engineVolume, setEngineVolume] = useState<number>();

	const startStopChangeHandler = (event: SelectChangeEvent) => {
		setStartStop(event.target.value);
	};

	const submitFormHandler = (event: FormEvent) => {
		event.preventDefault();

		onSubmitDiscount({
			vehicle: carBrand,
			productionYear: productionYear!,
			engineVolume: engineVolume!,
			startStop: startStop == "1" ? "Da" : "Ne"
		});
	};

	return (
		<div className="discount-modal" onClick={clickModalHandler}>
			<form
				className="car-detail-form"
				onClick={(event: MouseEvent<HTMLFormElement>) =>
					event.stopPropagation()
				}
				onSubmit={submitFormHandler}
			>
				<h3>
					Molimo da nam upisete podatke o vozilu kako bi pravilno ispunili
					garantni list
				</h3>
				<TextField
					label="Marka vozila"
					required
					onChange={(event: ChangeEvent<HTMLInputElement>) =>
						setCarBrand(event.target.value)
					}
					value={carBrand}
				/>
				<TextField
					label="Godina proizvodnje"
					required
					type="number"
					onChange={(event: ChangeEvent<HTMLInputElement>) =>
						setProductionYear(+event.target.value)
					}
					value={productionYear}
				/>
				<TextField
					label="Kubikaža motora"
					required
					type="number"
					onChange={(event: ChangeEvent<HTMLInputElement>) =>
						setEngineVolume(+event.target.value)
					}
					value={engineVolume}
				/>

				<InputLabel id="start-stop-label">Start-stop funkcija?</InputLabel>
				<Select
					required
					labelId="start-stop-label"
					id="start-stop"
					label="Start-stop funkcija?"
					value={startStop}
					onChange={startStopChangeHandler}
				>
					<MenuItem value={1}>Da</MenuItem>
					<MenuItem value={0}>Ne</MenuItem>
				</Select>
				<button type="submit">Dodaj</button>
			</form>
		</div>
	);
};

export default DiscountForm;
