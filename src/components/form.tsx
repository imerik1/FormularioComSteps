import { Step, TabTitle } from "@/components";
import { useForm } from "@/context";
import { IData, IUser } from "@/types";
import { Alert, AlertIcon, HStack, VStack } from "@chakra-ui/react";
import { FC, useState } from "react";

export const Form: FC = () => {
	const [isLoading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const { steps, handleSubmit, goToFirstError, reset, changeStep } = useForm();
	const onSubmit = async (user: IData) => {
		const headers = new Headers();
		headers.append("Content-Type", "application/json");
		setLoading(true);
		(user as IUser).createdAt = new Date().toISOString();
		await fetch("http://localhost:3004/users", {
			body: JSON.stringify(user),
			method: "POST",
			headers: headers,
		});
		setLoading(false);
		setSuccess(true);
		setTimeout(() => setSuccess(false), 3500);
		reset();
		changeStep(0);
	};
	return (
		<VStack as="section" p={4} w="100%" maxW="500px">
			<HStack
				as="ul"
				listStyleType="none"
				py={4}
				w="100%"
				gap={2}
				align="center"
				role="tab"
			>
				{Object.values(steps).map((step, index) => (
					<TabTitle key={index} index={index} step={step} />
				))}
			</HStack>
			<VStack
				onSubmit={handleSubmit(onSubmit, goToFirstError)}
				role="tabpanel"
				w="100%"
				h="fit-content"
				as="form"
			>
				<Step isLoading={isLoading} />
			</VStack>
			{success && (
				<Alert py={4} status="success">
					<AlertIcon />
					Criado com sucesso
				</Alert>
			)}
		</VStack>
	);
};
