import { useForm } from "@/context";
import {
	Button,
	FormControl,
	FormErrorMessage,
	FormLabel,
	HStack,
	VStack,
} from "@chakra-ui/react";
import { FC, useMemo } from "react";

type IProps = {
	isLoading: boolean;
};

export const Step: FC<IProps> = ({ isLoading }) => {
	const {
		steps,
		form: { currentStep },
		previousStep,
		nextStep,
		errors,
		reset,
	} = useForm();
	const fields = steps[currentStep]?.fields;
	const maximumSteps = useMemo(() => Object.keys(steps).length - 1, [steps]);
	const justOneButton = !(currentStep > 0 && currentStep < maximumSteps);
	return (
		<VStack gap={4} w="100%">
			{fields?.map((field, index) => {
				const error = (errors as any)[`${field.key}`];
				return (
					<FormControl
						isInvalid={!!error}
						isRequired={!!field.props.required}
						key={index}
					>
						<FormLabel htmlFor={`${field.key}`}>
							{field.props[`data-label`]}
						</FormLabel>
						{field}
						{error && <FormErrorMessage>{error.message}</FormErrorMessage>}
					</FormControl>
				);
			})}
			<HStack
				w="100%"
				justify={justOneButton ? "flex-end" : "space-between"}
				gap={4}
				align="center"
			>
				<Button
					isDisabled={isLoading}
					colorScheme="red"
					maxW="50%"
					flex={1}
					onClick={reset}
				>
					Limpar
				</Button>
				{currentStep > 0 && (
					<Button
						colorScheme="twitter"
						maxW="50%"
						flex={1}
						onClick={previousStep}
						isDisabled={isLoading}
					>
						Voltar
					</Button>
				)}
				{currentStep < Object.keys(steps).length - 1 && (
					<Button
						isDisabled={isLoading}
						colorScheme="twitter"
						maxW="50%"
						flex={1}
						onClick={nextStep}
					>
						Próximo
					</Button>
				)}
				{currentStep === Object.keys(steps).length - 1 && (
					<Button
						isLoading={isLoading}
						isDisabled={isLoading}
						type="submit"
						colorScheme="twitter"
						maxW="50%"
						flex={1}
					>
						Enviar
					</Button>
				)}
			</HStack>
		</VStack>
	);
};
