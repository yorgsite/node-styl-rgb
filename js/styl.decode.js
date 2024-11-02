"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseCharCallbackDataType = exports.ParseCharCallbackData = exports.StylDecoder = exports.StylDecoderTag = void 0;
var styl_ref_1 = require("./styl.ref");
var StylDecoderTag = /** @class */ (function () {
    function StylDecoderTag(type, tagName, value, pileType, code) {
        this.type = type;
        this.tagName = tagName;
        this.value = value;
        this.pileType = pileType;
        this.code = code;
    }
    StylDecoderTag.prototype.clone = function () {
        return new StylDecoderTag(this.type, this.tagName, this.value, this.pileType, this.code);
    };
    return StylDecoderTag;
}());
exports.StylDecoderTag = StylDecoderTag;
// const int = parseInt(str.slice(rtc.length));
// let val: number[] = [];
// if (rgbType === "256") {
// 	let v = int - 16;
// 	val = [Math.floor(v / 36), Math.floor(v / 6) % 6, v % 6].map(n => n * 51);
// } else {
// 	val = [Math.floor(int / 256), Math.floor(int / 256) % 256, int % 256];
// }
// return new StylDecoderTag(type, rgbType, val, "open");
var StylDecoder = /** @class */ (function () {
    function StylDecoder() {
        var _this = this;
        this.baseRef = new Map();
        Object.entries(styl_ref_1.styleRef).forEach(function (_a) {
            var tagName = _a[0], value = _a[1];
            var nums = _this.extractNumKey(value);
            ["open", "close"].forEach(function (pileType, i) {
                var tag = new StylDecoderTag("style", tagName, "", pileType, nums[i]);
                _this.baseRef.set(tag.code, tag);
            });
        });
        Object.entries(styl_ref_1.c16Ref).forEach(function (_a) {
            var type = _a[0], r = _a[1];
            Object.entries(r).forEach(function (_a) {
                var tagName = _a[0], value = _a[1];
                var nums = _this.extractNumKey(value);
                var tag = new StylDecoderTag(type, tagName, "", "open", nums[0]);
                _this.baseRef.set(tag.code, tag);
            });
        });
        this.baseRef.set("39", new StylDecoderTag("front", "front", "", "close", "39"));
        this.baseRef.set("49", new StylDecoderTag("back", "front", "", "close", "49"));
    }
    StylDecoder.prototype.extractNumKey = function (value) {
        return value.map(function (v) { return v.replace(/\x1B\[([0-9;]+)m/g, "$1"); });
    };
    StylDecoder.prototype.getTags = function (input) {
        var _this = this;
        var arr = input
            .split(/\x1B\[([0-9;]+)m/)
            .map(function (str, i) {
            if (i % 2) {
                var baseRef = _this.baseRef.get(str);
                if (baseRef)
                    return baseRef;
                for (var _i = 0, _a = [
                    ["256", "5"],
                    ["16m", "2"],
                ]; _i < _a.length; _i++) {
                    var _b = _a[_i], rgbType = _b[0], rtCode = _b[1];
                    for (var _c = 0, _d = [
                        ["front", "38"],
                        ["back", "48"],
                    ]; _c < _d.length; _c++) {
                        var _e = _d[_c], type = _e[0], tCode = _e[1];
                        var rtc = tCode + ";" + rtCode + ";";
                        if (str.indexOf(rtc) === 0) {
                            return new StylDecoderTag(type, rgbType, "", "open", str);
                        }
                    }
                }
                return new StylDecoderTag("unknown", "", str);
            }
            else {
                return str ? new StylDecoderTag("text", "", str) : null;
            }
        })
            .filter(function (v) { return v; });
        return arr;
    };
    Object.defineProperty(StylDecoder, "instance", {
        get: function () {
            return this._instance || (this._instance = new StylDecoder());
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Rearange contents to prevent recursive changes of value to break the parent value when it closes.
     * @param contents
     * @returns
     */
    StylDecoder.renderContents = function (contents) {
        var tags = StylDecoder.instance.getTags(contents);
        var fbpiles = {};
        var spiles = {};
        var texts = [];
        tags.forEach(function (t) {
            var _a, _b, _c, _d;
            if (t.type === "text") {
                var joiner_1 = ["", ""];
                if ((_a = fbpiles["front"]) === null || _a === void 0 ? void 0 : _a.length) {
                    joiner_1[0] += "\u001b[" + fbpiles["front"][0].code + "m";
                    joiner_1[1] = "\x1B[39m" + joiner_1[1];
                }
                if ((_b = fbpiles["back"]) === null || _b === void 0 ? void 0 : _b.length) {
                    joiner_1[0] += "\u001b[" + fbpiles["back"][0].code + "m";
                    joiner_1[1] = "\x1B[49m" + joiner_1[1];
                }
                Object.keys(spiles).forEach(function (k) {
                    var arr = styl_ref_1.styleRef[k];
                    joiner_1[0] += arr[0];
                    joiner_1[1] = arr[1] + joiner_1[1];
                });
                texts.push(joiner_1.join(t.value));
            }
            else {
                var tagName = t.type === "front" || t.type === "back" ? t.type : t.tagName;
                if (t.pileType === "open") {
                    if (t.type === "front" || t.type === "back") {
                        var tagName_1 = t.type;
                        if (!fbpiles[tagName_1])
                            fbpiles[tagName_1] = [];
                        fbpiles[tagName_1].unshift(t);
                    }
                    else {
                        var tagName_2 = t.tagName;
                        if (!spiles[tagName_2])
                            spiles[tagName_2] = [];
                        spiles[tagName_2].unshift(t);
                    }
                }
                else if (t.pileType === "close") {
                    if (t.type === "front" || t.type === "back") {
                        var tagName_3 = t.type;
                        if ((_c = fbpiles[tagName_3]) === null || _c === void 0 ? void 0 : _c.length) {
                            fbpiles[tagName_3].shift();
                            if (!fbpiles[tagName_3].length)
                                delete fbpiles[tagName_3];
                        }
                    }
                    else {
                        var tagName_4 = t.tagName;
                        if ((_d = spiles[tagName_4]) === null || _d === void 0 ? void 0 : _d.length) {
                            spiles[tagName_4].shift();
                            if (!spiles[tagName_4].length)
                                delete spiles[tagName_4];
                        }
                    }
                }
            }
        });
        return texts.join("");
    };
    return StylDecoder;
}());
exports.StylDecoder = StylDecoder;
var ParseCharCallbackData = /** @class */ (function () {
    function ParseCharCallbackData(col, row, char, rows) {
        this.col = col;
        this.row = row;
        this.char = char;
        this.rows = rows;
    }
    return ParseCharCallbackData;
}());
exports.ParseCharCallbackData = ParseCharCallbackData;
var ParseCharCallbackDataType = /** @class */ (function () {
    function ParseCharCallbackDataType() {
    }
    return ParseCharCallbackDataType;
}());
exports.ParseCharCallbackDataType = ParseCharCallbackDataType;
