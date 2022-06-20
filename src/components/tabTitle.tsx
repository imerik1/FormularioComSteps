import { useForm } from "@/context";
import { IStep } from "@/types";
import { Text } from "@chakra-ui/react";
import { FC } from "react";

type IProps = {
	index: number;
	step: IStep;
};

export const TabTitle: FC<IProps> = ({ index, step }) => {
	const {
		form: { currentStep },
		changeStep,
	} = useForm();
	return (
		<Text
			as="li"
			color="twitter.800"
			className={currentStep === index ? "active" : ""}
			cursor="pointer"
			py={1}
			key={index}
			onClick={() => changeStep(index)}
		>
			{step.title}
		</Text>
	);
};
