import { StylDemo } from "./styl.demo";
import { c16Ref, RgbInputType, styleRef } from "./styl.ref";
import { RgbRenderer, rgbRenderers, rgbType, StylRenderer } from "./styl.render";
import { HLBaseStyleType, HLColorKeys, HLColorType, HLStyleKeys } from "./styl.types";
import supportsColor from "./supportsColor";

export class StylData {
	front: RgbInputType | null;
	back: RgbInputType | null;
	styles: Map<HLBaseStyleType, boolean> = new Map();
	clone() {
		const sd = new StylData();
		sd.front = this.front;
		sd.back = this.back;
		sd.styles = new Map(this.styles);
		return sd;
	}
}

export class StylIO {
	private data = new StylData();
	private renderer: RgbRenderer;
	constructor(public rgbType: rgbType = "16m") {
		this.renderer = rgbRenderers[rgbType];
	}
	front(input: RgbInputType | null, v2?: number, v3?: number) {
		this.data.front =
			typeof input === "number" && typeof v2 === "number" && typeof v3 === "number"
				? [input, v2, v3]
				: input;
	}
	back(input: RgbInputType | null, v2?: number, v3?: number) {
		this.data.back =
			typeof input === "number" && typeof v2 === "number" && typeof v3 === "number"
				? [input, v2, v3]
				: input;
	}
	style(value: string | string[]) {
		(value instanceof Array ? value.join(",") : value).split(",").forEach(v => {
			const isRem = v.slice(0, 2) === "no";
			if (isRem) v = v.slice(2);
			const si = HLStyleKeys.indexOf(v);
			if (si > -1) {
				if (v.length === 1) {
					v = HLStyleKeys[si + 1];
				}
				this.data.styles.set(v as HLBaseStyleType, !isRem);
			}
		});
		return this;
	}
	renderFB(joiner: [string, string], type: "front" | "back", input: RgbInputType | null) {
		if (input) {
			if (typeof input === "string" && HLColorKeys.includes(input)) {
				const arr = c16Ref[type][input as HLColorType];
				joiner[0] += arr[0];
				joiner[1] = arr[1] + joiner[1];
			} else {
				const arr = [this.renderer.get(type, input), type === "front" ? "\x1B[39m" : "\x1B[49m"];
				joiner[0] += arr[0];
				joiner[1] = arr[1] + joiner[1];
			}
		}
	}
	renderStyle(joiner: [string, string]) {
		Array.from(this.data.styles.keys()).forEach(k => {
			const arr = styleRef[k];
			joiner[0] += arr[0];
			joiner[1] = arr[1] + joiner[1];
		});
	}

	renderJoiner(): [string, string] {
		const joiner: [string, string] = ["", ""];
		this.renderFB(joiner, "front", this.data.front);
		this.renderFB(joiner, "back", this.data.back);
		this.renderStyle(joiner);
		return joiner;
	}
	render(): StylRenderer {
		return new StylRenderer(this.renderJoiner());
	}
}

export type ParseCallbackDataType = {
	col: number;
	row: number;
	colP: number;
	rowP: number;
	width: number;
	height: number;
	rowWidth: number;
	char: string;
	styl: Styl;
};

export class Styl {
	private _io: StylIO;
	/**
	 * @param contents some text
	 * @param noContentDecode
	 * By default, Styl try to decode contents unicode to override correctly its settings at rendring time.<br/>
	 * - noContentDecode = false (default)
	 *   - This preseves the Styl instance default value from break codes and permit a recursuve uses of styl.<br/>
	 *     Like in this exemple :<code> console.log('2 colors : '+styl('red '+styl('green').green).red);</code>
	 * - noContentDecode = true<br/>
	 *   - Contents unicode will be ignored.<br/>
	 *     You may expect a faster rendering if your contents contains unicode but it may break the rendered result.<br/>
	 */
	constructor(rgbType: rgbType, public contents: string = "", public noContentDecode = false) {
		this._io = new StylIO(rgbType);
	}
	/**
	 * Sets front color
	 * @param input standard (ex:'red') or custom characters rgb color value
	 * (ex:'#f00' or '#ff0000' or [255,0,0] or 0xff0000)
	 * or number (red channel 0-255) if v2 & v3 are numbers.
	 * @param v2 green channel 0-255
	 * @param v3 blue channel 0-255
	 * @returns styl
	 */
	front(input: RgbInputType | null, v2?: number, v3?: number): Styl {
		this._io.front(input, v2, v3);
		return this;
	}

	/**
	 * Sets background color
	 * @param input standard (ex:'red') or custom background rgb color value
	 * (ex:'#f00' or '#ff0000' or [255,0,0] or 0xff0000)
	 * or number (red channel 0-255) if v2 & v3 are numbers.
	 * @param v2 green channel 0-255
	 * @param v3 blue channel 0-255
	 * @returns styl
	 */
	back(input: RgbInputType | null, v2?: number, v3?: number): Styl {
		this._io.back(input, v2, v3);
		return this;
	}
	/**
	 * sets styles
	 * @param value can be a style name like "bold" or a list of styles like "bold,i,u" or ["bold","i","u"]
	 * @returns
	 */
	style(value: string | string[]): Styl {
		this._io.style(value);
		return this;
	}
	/**
	 * Sets a new content
	 * @param text
	 */
	string(text: string) {
		this.contents = text;
		return this;
	}

	/**
	 * Parses string characters keeping trac of relatve position
	 * @param callback
	 * @returns
	 */
	parse(callback: (v: ParseCallbackDataType) => void) {
		const cr = this.contents.includes("\r\n") ? "\r\n" : "\n";
		const wlist = Styl.none(this.contents)
			.split(cr)
			.map(r => r.length);
		const width = wlist.reduce((a, c) => Math.max(a, c), 0);
		const height = wlist.length;

		let col = 0,
			row = 0;
		return this._io.renderJoiner().join(
			this.contents
				.split(/(\x1B\[[0-9;]+m)/)
				.map((str, i) => {
					if (i % 2 || !str) {
						return str;
					} else {
						return str
							.split(cr)
							.map((rr, ri) => {
								if (ri > 0) {
									col = 0;
									row++;
								}
								const rowWidth = wlist[row];
								return rr
									.split("")
									.map(char => {
										const obj: ParseCallbackDataType = {
											col,
											row,
											colP: col / Math.max(1, width - 1),
											rowP: row / Math.max(1, height - 1),
											width,
											height,
											rowWidth,
											char,
											styl: new Styl(this._io.rgbType, char),
										};
										callback(obj);
										col++;
										return obj.styl;
									})
									.join("");
							})
							.join(cr);
					}
				})
				.join("")
		);
	}

	toString(): string {
		return this._io.render().renderContents(this.contents);
	}
	// --- styles
	get b() {
		return this.style("bold");
	}
	get bold() {
		return this.style("bold");
	}
	get i() {
		return this.style("italic");
	}
	get italic() {
		return this.style("italic");
	}
	get u() {
		return this.style("underline");
	}
	get underline() {
		return this.style("underline");
	}
	get inverse() {
		return this.style("inverse");
	}
	get blink() {
		return this.style("blink");
	}
	get hidden() {
		return this.style("hidden");
	}
	get s() {
		return this.style("strikethrough");
	}
	get strikethrough() {
		return this.style("strikethrough");
	}
	// --- front colors
	get white() {
		return this.front("white");
	}
	get grey() {
		return this.front("grey");
	}
	get black() {
		return this.front("black");
	}
	get blue() {
		return this.front("blue");
	}
	get cyan() {
		return this.front("cyan");
	}
	get green() {
		return this.front("green");
	}
	get magenta() {
		return this.front("magenta");
	}
	get red() {
		return this.front("red");
	}
	get yellow() {
		return this.front("yellow");
	}
	// --- back colors
	get whiteBG() {
		return this.back("white");
	}
	get greyBG() {
		return this.back("grey");
	}
	get blackBG() {
		return this.back("black");
	}
	get blueBG() {
		return this.back("blue");
	}
	get cyanBG() {
		return this.back("cyan");
	}
	get greenBG() {
		return this.back("green");
	}
	get magentaBG() {
		return this.back("magenta");
	}
	get redBG() {
		return this.back("red");
	}
	get yellowBG() {
		return this.back("yellow");
	}

	get text() {
		return Styl.none(this.contents);
	}

	get theme(): (str: string) => string {
		const renderer = this._io.render();
		return function (contents: string): string {
			return renderer.renderContents(contents);
		};
	}

	static none(txt: string) {
		return txt.replace(/\x1B\[[0-9;]+m/g, "");
	}
}

export interface stylType {
	/**
	 * returns a Styl instance with witch you can chain colors an style for cli terminal
	 * Ex : console.log('This text is '+styl('red').red.bold.uderline+' or '+styl(' dark gren ').front('#457105').whilteBG);
	 * See more in Styl constructor.
	 * @param contents some text
	 * @param noContentDecode default=false see Styl constructor.
	 * @returns
	 */
	(contents?: string, noContentDecode?: boolean): Styl;

	none(txt: string): string;
	demo(): void;
	rgbType: rgbType;
}
const createStyl = (rgbType: rgbType): stylType => {
	const stylMethod = function (contents?: string, noContentDecode: boolean = false): Styl {
		return new Styl(stylMethod.rgbType, contents || "", noContentDecode);
	} as stylType;
	stylMethod.none = Styl.none;
	stylMethod.demo = () => StylDemo.demo(stylMethod);
	stylMethod.rgbType = rgbType;
	// Object.defineProperties(stylMethod, {
	// 	rgbType: { get: () => rgbType },
	// });
	return stylMethod;
};

export const c16m = createStyl("16m");
export const c256 = createStyl("256");

export const styl = supportsColor.stderr.has16m ? c16m : c256;
