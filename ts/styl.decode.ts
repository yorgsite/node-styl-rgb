import { c16Ref, styleRef } from "./styl.ref";
import { HLBaseStyleType } from "./styl.types";

export class StylDecoderTag {
	constructor(
		public type: string,
		public tagName: string,
		public value: string | number[],
		public pileType?: "open" | "close",
		public code?: string
	) {}
	clone() {
		return new StylDecoderTag(this.type, this.tagName, this.value, this.pileType, this.code);
	}
}
// const int = parseInt(str.slice(rtc.length));
// let val: number[] = [];
// if (rgbType === "256") {
// 	let v = int - 16;
// 	val = [Math.floor(v / 36), Math.floor(v / 6) % 6, v % 6].map(n => n * 51);
// } else {
// 	val = [Math.floor(int / 256), Math.floor(int / 256) % 256, int % 256];
// }
// return new StylDecoderTag(type, rgbType, val, "open");
export class StylDecoder {
	baseRef: Map<string, StylDecoderTag> = new Map();
	constructor() {
		Object.entries(styleRef).forEach(([tagName, value]) => {
			const nums = this.extractNumKey(value) as [string, string];
			["open", "close"].forEach((pileType, i) => {
				const tag = new StylDecoderTag("style", tagName, "", pileType as "open" | "close", nums[i]);
				this.baseRef.set(tag.code, tag);
			});
		});
		Object.entries(c16Ref).forEach(([type, r]) => {
			Object.entries(r).forEach(([tagName, value]) => {
				const nums = this.extractNumKey(value) as [string, string];
				const tag = new StylDecoderTag(type, tagName, "", "open", nums[0]);
				this.baseRef.set(tag.code, tag);
			});
		});
		this.baseRef.set("39", new StylDecoderTag("front", "front", "", "close", "39"));
		this.baseRef.set("49", new StylDecoderTag("back", "front", "", "close", "49"));
	}
	private extractNumKey(value: string[]) {
		return value.map(v => v.replace(/\x1B\[([0-9;]+)m/g, "$1"));
	}
	getTags(input: string) {
		const arr = input
			.split(/\x1B\[([0-9;]+)m/)
			.map((str, i) => {
				if (i % 2) {
					const baseRef = this.baseRef.get(str);
					if (baseRef) return baseRef;
					for (let [rgbType, rtCode] of [
						["256", "5"],
						["16m", "2"],
					]) {
						for (let [type, tCode] of [
							["front", "38"],
							["back", "48"],
						]) {
							let rtc = tCode + ";" + rtCode + ";";
							if (str.indexOf(rtc) === 0) {
								return new StylDecoderTag(type, rgbType, "", "open", str);
							}
						}
					}
					return new StylDecoderTag("unknown", "", str);
				} else {
					return str ? new StylDecoderTag("text", "", str) : null;
				}
			})
			.filter(v => v);
		return arr;
	}
	private static _instance: StylDecoder;
	static get instance() {
		return this._instance || (this._instance = new StylDecoder());
	}
	/**
	 * Rearange contents to prevent recursive changes of value to break the parent value when it closes.
	 * @param contents
	 * @returns
	 */
	static renderContents(contents: string) {
		const tags = StylDecoder.instance.getTags(contents);
		const fbpiles: { [k in "front" | "back"]?: StylDecoderTag[] } = {};
		const spiles: { [k in HLBaseStyleType]?: StylDecoderTag[] } = {};
		const texts: string[] = [];
		tags.forEach(t => {
			if (t.type === "text") {
				const joiner: [string, string] = ["", ""];
				if (fbpiles["front"]?.length) {
					joiner[0] += "\u001b[" + fbpiles["front"][0].code + "m";
					joiner[1] = "\x1B[39m" + joiner[1];
				}
				if (fbpiles["back"]?.length) {
					joiner[0] += "\u001b[" + fbpiles["back"][0].code + "m";
					joiner[1] = "\x1B[49m" + joiner[1];
				}
				Object.keys(spiles).forEach((k: HLBaseStyleType) => {
					const arr = styleRef[k];
					joiner[0] += arr[0];
					joiner[1] = arr[1] + joiner[1];
				});
				texts.push(joiner.join(t.value as string));
			} else {
				const tagName = t.type === "front" || t.type === "back" ? t.type : t.tagName;
				if (t.pileType === "open") {
					if (t.type === "front" || t.type === "back") {
						const tagName = t.type;
						if (!fbpiles[tagName]) fbpiles[tagName] = [];
						fbpiles[tagName].unshift(t);
					} else {
						const tagName = t.tagName as HLBaseStyleType;
						if (!spiles[tagName]) spiles[tagName] = [];
						spiles[tagName].unshift(t);
					}
				} else if (t.pileType === "close") {
					if (t.type === "front" || t.type === "back") {
						const tagName = t.type;
						if (fbpiles[tagName]?.length) {
							fbpiles[tagName].shift();
							if (!fbpiles[tagName].length) delete fbpiles[tagName];
						}
					} else {
						const tagName = t.tagName as HLBaseStyleType;
						if (spiles[tagName]?.length) {
							spiles[tagName].shift();
							if (!spiles[tagName].length) delete spiles[tagName];
						}
					}
				}
			}
		});
		return texts.join("");
	}
}
export class ParseCharCallbackData {
	width: number;
	constructor(public col: number, public row: number, public char: string, public rows: string[]) {}
}
export class ParseCharCallbackDataType {
	width: number;
	height: number;
	col: number;
	row: number;
	char: string;
	rows: string[];
}
