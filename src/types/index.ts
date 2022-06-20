export type IData = {
	name: string;
	email: string;
	country: string;
	description: string;
};

export type IFormData = {
	currentStep: number;
	data: IData;
};

export type IStep = {
	title: string;
	fields: JSX.Element[];
};

export type IUser = {
	id: number;
	name: string;
	email: string;
	country: string;
	description: string;
	createdAt: string;
};
