"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.styl = exports.c256 = exports.c16m = exports.Styl = exports.StylIO = exports.StylData = void 0;
var styl_demo_1 = require("./styl.demo");
var styl_ref_1 = require("./styl.ref");
var styl_render_1 = require("./styl.render");
var styl_types_1 = require("./styl.types");
var supportsColor_1 = __importDefault(require("./supportsColor"));
var StylData = /** @class */ (function () {
    function StylData() {
        this.styles = new Map();
    }
    StylData.prototype.clone = function () {
        var sd = new StylData();
        sd.front = this.front;
        sd.back = this.back;
        sd.styles = new Map(this.styles);
        return sd;
    };
    return StylData;
}());
exports.StylData = StylData;
var StylIO = /** @class */ (function () {
    function StylIO(rgbType) {
        if (rgbType === void 0) { rgbType = "16m"; }
        this.rgbType = rgbType;
        this.data = new StylData();
        this.renderer = styl_render_1.rgbRenderers[rgbType];
    }
    StylIO.prototype.front = function (input, v2, v3) {
        this.data.front =
            typeof input === "number" && typeof v2 === "number" && typeof v3 === "number"
                ? [input, v2, v3]
                : input;
    };
    StylIO.prototype.back = function (input, v2, v3) {
        this.data.back =
            typeof input === "number" && typeof v2 === "number" && typeof v3 === "number"
                ? [input, v2, v3]
                : input;
    };
    StylIO.prototype.style = function (value) {
        var _this = this;
        (value instanceof Array ? value.join(",") : value).split(",").forEach(function (v) {
            var isRem = v.slice(0, 2) === "no";
            if (isRem)
                v = v.slice(2);
            var si = styl_types_1.HLStyleKeys.indexOf(v);
            if (si > -1) {
                if (v.length === 1) {
                    v = styl_types_1.HLStyleKeys[si + 1];
                }
                _this.data.styles.set(v, !isRem);
            }
        });
        return this;
    };
    StylIO.prototype.renderFB = function (joiner, type, input) {
        if (input) {
            if (typeof input === "string" && styl_types_1.HLColorKeys.includes(input)) {
                var arr = styl_ref_1.c16Ref[type][input];
                joiner[0] += arr[0];
                joiner[1] = arr[1] + joiner[1];
            }
            else {
                var arr = [this.renderer.get(type, input), type === "front" ? "\x1B[39m" : "\x1B[49m"];
                joiner[0] += arr[0];
                joiner[1] = arr[1] + joiner[1];
            }
        }
    };
    StylIO.prototype.renderStyle = function (joiner) {
        Array.from(this.data.styles.keys()).forEach(function (k) {
            var arr = styl_ref_1.styleRef[k];
            joiner[0] += arr[0];
            joiner[1] = arr[1] + joiner[1];
        });
    };
    StylIO.prototype.renderJoiner = function () {
        var joiner = ["", ""];
        this.renderFB(joiner, "front", this.data.front);
        this.renderFB(joiner, "back", this.data.back);
        this.renderStyle(joiner);
        return joiner;
    };
    StylIO.prototype.render = function () {
        return new styl_render_1.StylRenderer(this.renderJoiner());
    };
    return StylIO;
}());
exports.StylIO = StylIO;
var Styl = /** @class */ (function () {
    /**
     * @param contents some text
     * @param noContentDecode
     * By default, Styl try to decode contents unicode to override correctly its settings at rendring time.<br/>
     * - noContentDecode = false (default)
     *   - This preseves the Styl instance default value from break codes and permit a recursuve uses of styl.<br/>
     *     Like in this exemple :<code> console.log('2 colors : '+styl('red '+styl('green').green).red);</code>
     * - noContentDecode = true<br/>
     *   - Contents unicode will be ignored.<br/>
     *     You may expect a faster rendering if your contents contains unicode but it may break the rendered result.<br/>	 */
    function Styl(rgbType, contents, noContentDecode) {
        if (contents === void 0) { contents = ""; }
        if (noContentDecode === void 0) { noContentDecode = false; }
        this.contents = contents;
        this.noContentDecode = noContentDecode;
        this._io = new StylIO(rgbType);
    }
    /**
     * Sets front color
     * @param input standard or custom front rgb color value or number (red channel 0-255) if v2 & v3 are numbers
     * @param v2 green channel 0-255
     * @param v3 blue channel 0-255
     * @returns
     */
    Styl.prototype.front = function (input, v2, v3) {
        this._io.front(input, v2, v3);
        return this;
    };
    /**
     * Sets background color
     * @param input standard or custom background rgb color value or number (red channel 0-255) if v2 & v3 are numbers
     * @param v2 green channel 0-255
     * @param v3 blue channel 0-255
     * @returns
     */
    Styl.prototype.back = function (input, v2, v3) {
        this._io.back(input, v2, v3);
        return this;
    };
    Styl.prototype.style = function (value) {
        this._io.style(value);
        return this;
    };
    /**
     * Sets a new content
     * @param text
     */
    Styl.prototype.string = function (text) {
        this.contents = text;
        return this;
    };
    /**
     *
     * @param callback
     * @returns
     */
    Styl.prototype.gradient = function (callback) {
        var _this = this;
        var cr = this.contents.includes("\r\n") ? "\r\n" : "\n";
        var wlist = Styl.none(this.contents)
            .split(cr)
            .map(function (r) { return r.length; });
        var width = wlist.reduce(function (a, c) { return Math.max(a, c); }, 0);
        var height = wlist.length;
        var col = 0, row = 0;
        return this._io.renderJoiner().join(this.contents
            .split(/(\x1B\[[0-9;]+m)/)
            .map(function (str, i) {
            if (i % 2 || !str) {
                return str;
            }
            else {
                return str
                    .split(cr)
                    .map(function (rr, ri) {
                    if (ri > 0) {
                        col = 0;
                        row++;
                    }
                    var rowWidth = wlist[row];
                    return rr
                        .split("")
                        .map(function (char) {
                        var obj = {
                            col: col,
                            row: row,
                            colP: col / Math.max(1, width - 1),
                            rowP: row / Math.max(1, height - 1),
                            width: width,
                            height: height,
                            rowWidth: rowWidth,
                            char: char,
                            styl: new Styl(_this._io.rgbType, char),
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
            .join(""));
    };
    Styl.prototype.toString = function () {
        return this._io.render().renderContents(this.contents);
    };
    Object.defineProperty(Styl.prototype, "b", {
        // --- styles
        get: function () {
            return this.style("bold");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Styl.prototype, "bold", {
        get: function () {
            return this.style("bold");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Styl.prototype, "i", {
        get: function () {
            return this.style("italic");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Styl.prototype, "italic", {
        get: function () {
            return this.style("italic");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Styl.prototype, "u", {
        get: function () {
            return this.style("underline");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Styl.prototype, "underline", {
        get: function () {
            return this.style("underline");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Styl.prototype, "inverse", {
        get: function () {
            return this.style("inverse");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Styl.prototype, "blink", {
        get: function () {
            return this.style("blink");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Styl.prototype, "hidden", {
        get: function () {
            return this.style("hidden");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Styl.prototype, "s", {
        get: function () {
            return this.style("strikethrough");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Styl.prototype, "strikethrough", {
        get: function () {
            return this.style("strikethrough");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Styl.prototype, "white", {
        // --- front colors
        get: function () {
            return this.front("white");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Styl.prototype, "grey", {
        get: function () {
            return this.front("grey");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Styl.prototype, "black", {
        get: function () {
            return this.front("black");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Styl.prototype, "blue", {
        get: function () {
            return this.front("blue");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Styl.prototype, "cyan", {
        get: function () {
            return this.front("cyan");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Styl.prototype, "green", {
        get: function () {
            return this.front("green");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Styl.prototype, "magenta", {
        get: function () {
            return this.front("magenta");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Styl.prototype, "red", {
        get: function () {
            return this.front("red");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Styl.prototype, "yellow", {
        get: function () {
            return this.front("yellow");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Styl.prototype, "whiteBG", {
        // --- back colors
        get: function () {
            return this.back("white");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Styl.prototype, "greyBG", {
        get: function () {
            return this.back("grey");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Styl.prototype, "blackBG", {
        get: function () {
            return this.back("black");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Styl.prototype, "blueBG", {
        get: function () {
            return this.back("blue");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Styl.prototype, "cyanBG", {
        get: function () {
            return this.back("cyan");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Styl.prototype, "greenBG", {
        get: function () {
            return this.back("green");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Styl.prototype, "magentaBG", {
        get: function () {
            return this.back("magenta");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Styl.prototype, "redBG", {
        get: function () {
            return this.back("red");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Styl.prototype, "yellowBG", {
        get: function () {
            return this.back("yellow");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Styl.prototype, "text", {
        get: function () {
            return Styl.none(this.contents);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Styl.prototype, "theme", {
        get: function () {
            var renderer = this._io.render();
            return function (contents) {
                return renderer.renderContents(contents);
            };
        },
        enumerable: false,
        configurable: true
    });
    Styl.none = function (txt) {
        return txt.replace(/\x1B\[[0-9;]+m/g, "");
    };
    return Styl;
}());
exports.Styl = Styl;
var createStyl = function (rgbType) {
    var stylMethod = function (contents, noContentDecode) {
        if (noContentDecode === void 0) { noContentDecode = false; }
        return new Styl(stylMethod.rgbType, contents || "", noContentDecode);
    };
    stylMethod.none = Styl.none;
    stylMethod.demo = function () { return styl_demo_1.StylDemo.demo(stylMethod); };
    stylMethod.rgbType = rgbType;
    // Object.defineProperties(stylMethod, {
    // 	rgbType: { get: () => rgbType },
    // });
    return stylMethod;
};
exports.c16m = createStyl("16m");
exports.c256 = createStyl("256");
exports.styl = supportsColor_1.default.stderr.has16m ? exports.c16m : exports.c256;
