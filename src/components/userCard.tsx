import { IUser } from "@/types";
import { HStack, Tag, Text, VStack } from "@chakra-ui/react";
import { FC, useMemo } from "react";

type IProps = {
	user: IUser;
};

export const UserCard: FC<IProps> = ({ user }) => {
	const dateTime = useMemo(
		() =>
			`${new Date(user.createdAt).toLocaleDateString("pt-br")} ${new Date(
				user.createdAt
			).toLocaleTimeString("pt-br")}`,
		[user]
	);
	return (
		<VStack
			borderRadius="20px"
			border="1px solid black"
			w="340px"
			h="fit-content"
			p={4}
			align="flex-start"
		>
			<Text>
				<strong>Nome:</strong> {user.name}
			</Text>
			<Text>
				<strong>Email:</strong> {user.email}
			</Text>
			<Text>
				<strong>Descrição:</strong> {user.description}
			</Text>
			<HStack>
				<Tag>{dateTime}</Tag>
				<Tag>{user.country}</Tag>
			</HStack>
		</VStack>
	);
};
