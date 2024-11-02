import { Styl, stylType } from "./styl.core";
import { rgbType } from "./styl.render";

export class StylDemo {
	demoList = [
		function (styl: stylType) {
			console.log("-".repeat(10) + "|" + styl("node-styl demo").green.bold + "|" + "-".repeat(10));
		},
		function (styl: stylType) {
			console.log("* Recursive styling :");
			const testTxt =
				"" +
				styl(
					"test1 " +
						styl("custom ").front("#08f") +
						styl("green ").back([100, 255, 50]).black +
						styl(" cyan ").cyan.italic.bold +
						styl("un" + styl("der").red + "line").u
				).green +
				" " +
				styl("blink").blink;
			console.log(testTxt);
		},
		function (styl: stylType) {
			console.log("Using " + styl("parse").bold + " make easier to create");
		},
		function (styl: stylType) {
			console.log("* Horizontal gradient :");
			console.log(
				styl("gradient " + styl("underlined").underline + " text").parse(obj =>
					obj.styl.back([255 * obj.colP, 0, 0]).front([255, 255 * obj.colP, 255])
				) + ""
			);
		},
		function (styl: stylType) {
			console.log("* 2d gradient :");
			console.log(
				styl("gradient displayed\non multiple\nrows with some\n2d variations").parse(obj => {
					obj.styl.front([255 * (1 - obj.colP), 255 * obj.colP, 255 * obj.rowP]);
				}) + ""
			);
		},
		function (styl: stylType) {
			console.log("* box :");
			console.log(
				styl(
					[
						"+---------------+",
						"|               |",
						"|  " + styl(`checkerboard`).bold + " |",
						"|     in a      |",
						"|      box      |",
						"|               |",
						"+---------------+",
					].join("\n")
				).parse(obj => {
					if ("+-|".includes(obj.char)) {
						obj.styl.back([255 * obj.colP, 255 * obj.rowP, 255 * (1 - obj.colP * obj.rowP)]).hidden;
					} else if (Math.round(obj.col * 0.5 + obj.row) % 2) obj.styl.back("#444");
				}) + ""
			);
		},
		function (styl: stylType) {
			console.log("* etc...");
		},
	];
	private _codeThemes?: { [t: string]: { [k: string]: DemoTheme } } = {};
	private _codeLogs?: { [t: string]: string[] } = {};
	constructor() {}
	demo(styl: stylType) {
		let codeStr = "<code>";
		const codes = this.getCodeLogs(styl);
		const cstr = Math.floor((process.stdout.columns - 2 - codeStr.length) * 0.3);
		codeStr = "" + styl(" ".repeat(cstr) + codeStr + " ".repeat(cstr) + "_").u;
		this.demoList.forEach((cb, i) => {
			cb(styl);
			console.log(codeStr + codes[i]);
			console.log("-".repeat(process.stdout.columns - 2));
		});
		console.log("\n");
	}

	getCodeTheme(rgbType: rgbType) {
		if (this._codeThemes[rgbType]) return this._codeThemes[rgbType];
		return (this._codeThemes[rgbType] = {
			object: new DemoTheme(new Styl(rgbType).cyan.theme, /(?:console|obj)/g),
			native: new DemoTheme(
				new Styl(rgbType).front([140, 140, 255]).theme,
				/(?:function|if|else|Math)/g
			),
			styl: new DemoTheme(
				new Styl(rgbType).front([255, 128, 0]).theme,
				/(?:\(0, exports\.styl\)|styl(?![a-z\s]))/g,
				(v: string) => "styl"
			),
			number: new DemoTheme(
				new Styl(rgbType).front([255, 100, 100]).theme,
				/(?!\x1B\[.*?m)\d+\b(?!;|m])/g
			),
			parentez: new DemoTheme(new Styl(rgbType).front([255, 0, 255]).theme, /(?:\(|\))/g),
			crochet: new DemoTheme(new Styl(rgbType).front([100, 100, 255]).theme, /(?:\{|\})/g),
			array: new DemoTheme(new Styl(rgbType).front([255, 255, 0]).theme, /(?<!\x1B)(\[|\])/g),
			string: new DemoTheme(new Styl(rgbType).green.theme, /".*"/g),
			sub: new DemoTheme(
				new Styl(rgbType).yellow.theme,
				/\.[a-zA-Z]+/g,
				(v: string) => "." + v.slice(1)
			),
			back: new DemoTheme(
				new Styl(rgbType).back(rgbType === "16m" ? [28, 28, 28] : [0, 0, 0]).theme,
				/.*/g
			),
		});
	}
	getCodeLogs(styl: stylType) {
		const rgbType = styl.rgbType;
		if (this._codeLogs[rgbType]) return this._codeLogs[rgbType];
		this._codeLogs[rgbType] = [];
		const themes = this.getCodeTheme(rgbType);
		this.demoList.map(cb => {
			let cbst = (cb + "")
				.split("\n")
				.slice(1, -1)
				.map(r => r.slice(16) + "  ")
				.join("\n");

			Object.entries(themes)
				.filter(([k]) => k !== "back")
				.map(([k, e]) => {
					cbst = cbst.replace(e.reg, v => e.theme(e.tr(v)) + "");
				});

			this._codeLogs[rgbType].push(themes.back.theme("\n" + cbst));
		});
		return this._codeLogs[rgbType];
	}

	private static _instance: StylDemo;
	static get instance() {
		return this._instance || (this._instance = new StylDemo());
	}
	static demo(styl: stylType) {
		StylDemo.instance.demo(styl);
	}
}
class DemoTheme {
	constructor(
		public theme: (v: string) => string,
		public reg: RegExp,
		public tr: (v: string) => string = v => v
	) {}
}
