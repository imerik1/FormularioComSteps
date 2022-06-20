import { Form, UserCard } from "@/components";
import { FormProvider } from "@/context";
import { IFormData, IUser } from "@/types";
import {
	Button,
	HStack,
	ListItem,
	Popover,
	PopoverArrow,
	PopoverBody,
	PopoverCloseButton,
	PopoverContent,
	PopoverTrigger,
	Text,
	UnorderedList,
	VStack,
} from "@chakra-ui/react";
import { NextPage } from "next";
import nookies from "nookies";
import useSWR from "swr";

type IProps = {
	prefetchUsers: IUser[];
	formData: IFormData;
};

const Index: NextPage<IProps> = ({ formData, prefetchUsers }) => {
	const { data: users } = useSWR<IUser[]>("http://localhost:3004/users", {
		fallbackData: prefetchUsers,
	});
	return (
		<HStack
			wrap="wrap"
			align="center"
			justify="center"
			gap={12}
			w="100vw"
			minH="100vh"
		>
			<VStack w="fit-content" h="fit-content">
				<Text as="h1" px={4} py={2} fontSize={22}>
					Formulário com etapas e memorização
				</Text>
				<FormProvider formData={formData}>
					<Form />
				</FormProvider>
				<Popover>
					<PopoverTrigger>
						<Button mx={4}>O que ele faz?</Button>
					</PopoverTrigger>
					<PopoverContent mx={4}>
						<PopoverArrow />
						<PopoverCloseButton />
						<PopoverBody>
							<strong>Contém algumas features:</strong>
							<UnorderedList>
								<ListItem>Limpa todos os campos</ListItem>
								<ListItem>
									Guarda os campos até 10 minutos, mesmo fechando o navegador
								</ListItem>
								<ListItem>Performático</ListItem>
								<ListItem>
									Redireciona para a primeira página de erro encontrada quando
									ocorrer um
								</ListItem>
							</UnorderedList>
						</PopoverBody>
					</PopoverContent>
				</Popover>
			</VStack>
			<VStack w="fit-content" h="fit-content">
				{users?.length === 0 && <Text>Não há usuários</Text>}
				{users?.map((user) => {
					return <UserCard key={user.id} user={user} />;
				})}
			</VStack>
		</HStack>
	);
};

Index.getInitialProps = async (ctx) => {
	const { _formData } = nookies.get(ctx);
	const { currentStep, data }: IFormData = _formData
		? JSON.parse(_formData)
		: {
				currentStep: 0,
				data: {
					name: "",
					email: "",
					country: "",
					description: "",
				},
		  };
	const request = await fetch("http://localhost:3004/users");
	const prefetchUsers = await request.json();
	return {
		prefetchUsers,
		formData: {
			currentStep,
			data,
		},
	};
};

export default Index;
