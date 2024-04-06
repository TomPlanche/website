// Type(s)
export type T_Cursor = {
	isHover: boolean;
	scale: number;
	opacity: number;
	svg: string;
	innerText: string;
	backgroundColor: string;
	blur: number;
};

export type T_CursorOptions = {
	[key in keyof T_Cursor]?: T_Cursor[key];
};

export type T_OnEnter = (cursorOptions?: T_CursorOptions) => void;

export type T_OnLeave = T_OnEnter;

export type TUserLocation = {
	location: string;
	coords: {
		lat: number;
		lon: number;
	};
	ip: `${number}.${number}.${number}.${number}`;
};
