import { AbstractCustomError } from "./AbstractCustomError";
import { StylDecoder } from "./styl.decode";
import { RgbInputType, RgbRenderType, c16m, c256 } from "./styl.ref";

class RgbRendererError extends AbstractCustomError {
	constructor(methodName: string, message: string) {
		super(RgbRendererError, RgbRenderer, methodName, message);
	}
}
export class RgbRenderer {
	constructor(public renderData: RgbRenderType) {}
	/**
	 * tranforms a color value to a rgb value
	 * @param input
	 * @returns
	 */
	toRgb(input: RgbInputType, errorType: string = "color"): [number, number, number] {
		if (input instanceof Array)
			return (input.length < 3 ? input.concat(Array(3 - input.length).fill(0)) : input)
				.slice(0, 3)
				.map(v => Math.max(0, Math.min(255, v))) as [number, number, number];

		if (typeof input === "string") {
			if (/^#[0-9a-fA-F]{3,6}$/.test(input)) {
				let txt = input.slice(1);
				if (txt.length === 3) {
					txt = txt.charAt(0).repeat(2) + txt.charAt(1).repeat(2) + txt.charAt(2).repeat(2);
				}
				input = parseInt(txt, 16);
			}
		}
		if (typeof input === "number") {
			input = Math.max(0, Math.min(16777215, input));
			return [Math.floor(input / 65536), Math.floor(input / 256) % 256, input % 256];
		}
		throw new RgbRendererError("toRgb", "Invalid " + errorType + " value : " + input);
	}
	private _getCode(input: RgbInputType, errorType: string = "color"): string {
		return this.renderData.getCode(this.toRgb(input, errorType));
	}
	get(type: "front" | "back", input: RgbInputType): string {
		return type === "front" ? this.getFront(input) : this.getBack(input);
	}
	getFront(input: RgbInputType): string {
		return this.renderData.getFront(this._getCode(input, "front"));
	}
	getBack(input: RgbInputType): string {
		return this.renderData.getBack(this._getCode(input, "back"));
	}
	// return txt.length ? [txt, '\x1B[39m\x1B[49m'] : ['', ''];
}
export type rgbType = "256" | "16m";
export const rgbRenderers: { [k in rgbType]: RgbRenderer } = {
	"256": new RgbRenderer(c256),
	"16m": new RgbRenderer(c16m),
};

export class StylRenderer {
	constructor(public joiner: [string, string]) {}
	renderContents(contents: string, noContentDecode = false) {
		const rendered = this.joiner.join(contents);
		if (noContentDecode || !contents?.includes("\x1B[")) return rendered;
		return StylDecoder.renderContents(rendered);
	}
}
