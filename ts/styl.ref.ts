import { HLBaseStyleType, HLColorType } from "./styl.types";

export const styleRef: { [kk in HLBaseStyleType]: [string, string] } = {
	bold: ["\x1B[1m", "\x1B[22m"],
	// dim: ["\x1B[2m", "\x1B[22m"],
	italic: ["\x1B[3m", "\x1B[23m"],
	underline: ["\x1B[4m", "\x1B[24m"],
	blink: ["\x1B[5m", "\x1B[25m"],
	inverse: ["\x1B[7m", "\x1B[27m"],
	hidden: ["\x1B[8m", "\x1B[28m"],
	strikethrough: ["\x1B[9m", "\x1B[29m"],
};

export const c16Ref: { [k in "front" | "back"]: { [kk in HLColorType]: [string, string] } } = {
	front: {
		white: ["\x1B[37m", "\x1B[39m"],
		grey: ["\x1B[90m", "\x1B[39m"],
		black: ["\x1B[30m", "\x1B[39m"],
		//others
		blue: ["\x1B[34m", "\x1B[39m"],
		cyan: ["\x1B[36m", "\x1B[39m"],
		green: ["\x1B[32m", "\x1B[39m"],
		magenta: ["\x1B[35m", "\x1B[39m"],
		red: ["\x1B[31m", "\x1B[39m"],
		yellow: ["\x1B[33m", "\x1B[39m"],
	},
	back: {
		white: ["\x1B[47m", "\x1B[49m"],
		grey: ["\x1b[100m", "\x1B[49m"],
		black: ["\x1B[40m", "\x1B[49m"],
		//others
		blue: ["\x1B[44m", "\x1B[49m"],
		cyan: ["\x1B[46m", "\x1B[49m"],
		green: ["\x1B[42m", "\x1B[49m"],
		magenta: ["\x1B[45m", "\x1B[49m"],
		red: ["\x1B[41m", "\x1B[49m"],
		yellow: ["\x1B[43m", "\x1B[49m"],
	},
};

export type RgbRenderType = {
	getCode: (v: number[]) => string;
	getFront: (code: string) => string;
	getBack: (code: string) => string;
};
export const c256 = {
	getCode: (rgb: number[]) => {
		const srgb = rgb.map(d => Math.max(0, Math.min(5, Math.round(d / 55))));
		return 16 + srgb[0] * 36 + srgb[1] * 6 + srgb[2] + "";
	},
	getFront: (code: string) => "\x1b[38;5;" + code + "m",
	getBack: (code: string) => "\x1b[48;5;" + code + "m",
};
export const c16m = {
	getCode: (rgb: number[]) => rgb.map(d => Math.floor(Math.max(0, Math.min(255, d)))).join(";"),
	getFront: (code: string) => "\x1b[38;2;" + code + "m",
	getBack: (code: string) => "\x1b[48;2;" + code + "m",
};
export type RgbInputType = string | number | [number, number, number];
