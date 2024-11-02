"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StylDemo = void 0;
var styl_core_1 = require("./styl.core");
var StylDemo = /** @class */ (function () {
    function StylDemo() {
        this.demoList = [
            function (styl) {
                console.log("-".repeat(10) + "|" + styl("node-styl demo").green.bold + "|" + "-".repeat(10));
            },
            function (styl) {
                console.log("* Recursive styling :");
                var testTxt = "" +
                    styl("test1 " +
                        styl("custom ").front("#08f") +
                        styl("green ").back([100, 255, 50]).black +
                        styl(" cyan ").cyan.italic.bold +
                        styl("un" + styl("der").red + "line").u).green +
                    " " +
                    styl("blink").blink;
                console.log(testTxt);
            },
            function (styl) {
                console.log("Using " + styl("parse").bold + " make easier to create");
            },
            function (styl) {
                console.log("* Horizontal gradient :");
                console.log(styl("gradient " + styl("underlined").underline + " text").gradient(function (obj) {
                    return obj.styl.back([255 * obj.colP, 0, 0]).front([255, 255 * obj.colP, 255]);
                }) + "");
            },
            function (styl) {
                console.log("* 2d gradient :");
                console.log(styl("gradient displayed\non multiple\nrows with some\n2d variations").gradient(function (obj) {
                    obj.styl.front([255 * (1 - obj.colP), 255 * obj.colP, 255 * obj.rowP]);
                }) + "");
            },
            function (styl) {
                console.log("* box :");
                console.log(styl([
                    "+---------------+",
                    "|               |",
                    "|  " + styl("checkerboard").bold + " |",
                    "|     in a      |",
                    "|      box      |",
                    "|               |",
                    "+---------------+",
                ].join("\n")).gradient(function (obj) {
                    if ("+-|".includes(obj.char)) {
                        obj.styl.back([255 * obj.colP, 255 * obj.rowP, 255 * (1 - obj.colP * obj.rowP)]).hidden;
                    }
                    else if (Math.round(obj.col * 0.5 + obj.row) % 2)
                        obj.styl.back("#444");
                }) + "");
            },
            function (styl) {
                console.log("* etc...");
            },
        ];
        this._codeThemes = {};
        this._codeLogs = {};
    }
    StylDemo.prototype.demo = function (styl) {
        var codeStr = "<code>";
        var codes = this.getCodeLogs(styl);
        var cstr = Math.floor((process.stdout.columns - 2 - codeStr.length) * 0.3);
        codeStr = "" + styl(" ".repeat(cstr) + codeStr + " ".repeat(cstr) + "_").u;
        this.demoList.forEach(function (cb, i) {
            cb(styl);
            console.log(codeStr + codes[i]);
            console.log("-".repeat(process.stdout.columns - 2));
        });
        console.log("\n");
    };
    StylDemo.prototype.getCodeTheme = function (rgbType) {
        if (this._codeThemes[rgbType])
            return this._codeThemes[rgbType];
        return (this._codeThemes[rgbType] = {
            object: new DemoTheme(new styl_core_1.Styl(rgbType).cyan.theme, /(?:console|obj)/g),
            native: new DemoTheme(new styl_core_1.Styl(rgbType).front([140, 140, 255]).theme, /(?:function|if|else|Math)/g),
            styl: new DemoTheme(new styl_core_1.Styl(rgbType).front([255, 128, 0]).theme, /(?:\(0, exports\.styl\)|styl(?![a-z\s]))/g, function (v) { return "styl"; }),
            number: new DemoTheme(new styl_core_1.Styl(rgbType).front([255, 100, 100]).theme, /(?!\x1B\[.*?m)\d+\b(?!;|m])/g),
            parentez: new DemoTheme(new styl_core_1.Styl(rgbType).front([255, 0, 255]).theme, /(?:\(|\))/g),
            crochet: new DemoTheme(new styl_core_1.Styl(rgbType).front([100, 100, 255]).theme, /(?:\{|\})/g),
            array: new DemoTheme(new styl_core_1.Styl(rgbType).front([255, 255, 0]).theme, /(?<!\x1B)(\[|\])/g),
            string: new DemoTheme(new styl_core_1.Styl(rgbType).green.theme, /".*"/g),
            sub: new DemoTheme(new styl_core_1.Styl(rgbType).yellow.theme, /\.[a-zA-Z]+/g, function (v) { return "." + v.slice(1); }),
            back: new DemoTheme(new styl_core_1.Styl(rgbType).back(rgbType === "16m" ? [28, 28, 28] : [0, 0, 0]).theme, /.*/g),
        });
    };
    StylDemo.prototype.getCodeLogs = function (styl) {
        var _this = this;
        var rgbType = styl.rgbType;
        if (this._codeLogs[rgbType])
            return this._codeLogs[rgbType];
        this._codeLogs[rgbType] = [];
        var themes = this.getCodeTheme(rgbType);
        this.demoList.map(function (cb) {
            var cbst = (cb + "")
                .split("\n")
                .slice(1, -1)
                .map(function (r) { return r.slice(16) + "  "; })
                .join("\n");
            Object.entries(themes)
                .filter(function (_a) {
                var k = _a[0];
                return k !== "back";
            })
                .map(function (_a) {
                var k = _a[0], e = _a[1];
                cbst = cbst.replace(e.reg, function (v) { return e.theme(e.tr(v)) + ""; });
            });
            _this._codeLogs[rgbType].push(themes.back.theme("\n" + cbst));
        });
        return this._codeLogs[rgbType];
    };
    Object.defineProperty(StylDemo, "instance", {
        get: function () {
            return this._instance || (this._instance = new StylDemo());
        },
        enumerable: false,
        configurable: true
    });
    StylDemo.demo = function (styl) {
        StylDemo.instance.demo(styl);
    };
    return StylDemo;
}());
exports.StylDemo = StylDemo;
var DemoTheme = /** @class */ (function () {
    function DemoTheme(theme, reg, tr) {
        if (tr === void 0) { tr = function (v) { return v; }; }
        this.theme = theme;
        this.reg = reg;
        this.tr = tr;
    }
    return DemoTheme;
}());
