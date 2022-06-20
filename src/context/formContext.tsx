import { countries } from "@/constants";
import { IData, IFormData, IStep } from "@/types";
import { Input, Select, Textarea } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { destroyCookie, setCookie } from "nookies";
import {
	createContext,
	FC,
	PropsWithChildren,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import * as HookForm from "react-hook-form";
import * as yup from "yup";

const fieldsKeys = ["name", "email", "country", "description"];

const schema = yup.object().shape({
	name: yup.string().required("O nome é obrigatório"),
	email: yup
		.string()
		.required("O e-mail é obrigatório")
		.email("O e-mail deve ser válido"),
	country: yup.string().required("O país é obrigatório"),
	description: yup
		.string()
		.required("A descrição é obrigatória")
		.min(5, "A descrição deve ter no mínimo 5 caracteres"),
});

type FormContext = {
	steps: { [key: number]: IStep };
	form: IFormData;
	nextStep: () => void;
	previousStep: () => void;
	changeStep: (step: number) => void;
	errors: {
		name?: HookForm.FieldError | undefined;
		email?: HookForm.FieldError | undefined;
		country?: HookForm.FieldError | undefined;
		description?: HookForm.FieldError | undefined;
	};
	handleSubmit: HookForm.UseFormHandleSubmit<IData>;
	reset: () => void;
	goToFirstError: () => void;
};

export const formContext = createContext({} as FormContext);

type IProps = {
	formData: IFormData;
};

export const FormProvider: FC<PropsWithChildren<IProps>> = ({
	children,
	formData,
}) => {
	const {
		reset: resetFields,
		handleSubmit,
		register,
		getValues,
		formState: { errors },
	} = HookForm.useForm<IData>({
		resolver: yupResolver(schema),
	});
	const [form, setForm] = useState(formData);
	useEffect(() => {
		const date = new Date();
		date.setTime(date.getTime() + 10 * 60 * 1000);
		destroyCookie(null, "_formData");
		setCookie(null, "_formData", JSON.stringify(form), {
			expires: date,
		});
	}, [form]);
	const reset = () => {
		const newForm: IFormData = Object.assign({}, form);
		fieldsKeys.forEach((key) => {
			(newForm as any).data[key] = "";
		});
		setForm(newForm);
		destroyCookie(null, "_formData");
		resetFields();
	};
	const updateData = useCallback(
		(step: number) => {
			const newForm: IFormData = Object.assign({}, form);
			fieldsKeys.forEach((key) => {
				(newForm as any).data[key] = getValues(key as any);
			});
			newForm.currentStep = step;
			setForm(newForm);
		},
		[form, getValues]
	);
	const nextStep = useCallback(() => {
		updateData(form.currentStep + 1);
	}, [updateData, form.currentStep]);
	const previousStep = useCallback(() => {
		updateData(form.currentStep - 1);
	}, [updateData, form.currentStep]);
	const changeStep = useCallback(
		(step: number) => {
			updateData(step);
		},
		[updateData]
	);
	const steps: { [key: number]: IStep } = useMemo(() => {
		return {
			0: {
				title: "Primeiro Passo",
				fields: [
					<Input
						key="name"
						type="text"
						placeholder="Digite seu nome"
						defaultValue={form.data.name}
						id="name"
						data-label="Nome"
						{...register("name")}
					/>,
					<Input
						key="email"
						type="email"
						placeholder="Digite seu e-mail"
						defaultValue={form.data.email}
						id="email"
						data-label="E-mail"
						{...register("email")}
					/>,
				],
			},
			1: {
				title: "Segundo Passo",
				fields: [
					<Select
						key="country"
						placeholder="Digite seu país"
						id="country"
						data-label="País"
						{...register("country")}
						defaultValue={form.data.country}
					>
						{countries.map((country) => {
							return (
								<option value={country.nome} key={country.ordem}>
									{country.nome}
								</option>
							);
						})}
					</Select>,
				],
			},
			2: {
				title: "Terceiro Passo",
				fields: [
					<Textarea
						key="description"
						placeholder="Digite a descrição"
						rows={6}
						resize="none"
						id="description"
						data-label="Descrição"
						defaultValue={form.data.description}
						{...register("description")}
					/>,
				],
			},
		};
	}, [register, form.data]);
	const goToFirstError = useCallback(() => {
		const stepsWithErrors: Set<number> = new Set();
		Object.entries(steps).forEach(([key, step]) => {
			Object.keys(errors).forEach((keyField) => {
				step.fields.forEach((field) => {
					if (field.key === keyField) {
						stepsWithErrors.add(Number(key));
					}
				});
			});
		});
		changeStep(stepsWithErrors.values().next().value || 0);
	}, [errors, steps, changeStep]);
	return (
		<formContext.Provider
			value={{
				steps,
				form,
				nextStep,
				previousStep,
				changeStep,
				errors,
				handleSubmit,
				reset,
				goToFirstError,
			}}
		>
			{children}
		</formContext.Provider>
	);
};

export const useForm = () => {
	return useContext(formContext);
};
