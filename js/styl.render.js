"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.StylRenderer = exports.rgbRenderers = exports.RgbRenderer = void 0;
var AbstractCustomError_1 = require("./AbstractCustomError");
var styl_decode_1 = require("./styl.decode");
var styl_ref_1 = require("./styl.ref");
var RgbRendererError = /** @class */ (function (_super) {
    __extends(RgbRendererError, _super);
    function RgbRendererError(methodName, message) {
        return _super.call(this, RgbRendererError, RgbRenderer, methodName, message) || this;
    }
    return RgbRendererError;
}(AbstractCustomError_1.AbstractCustomError));
var RgbRenderer = /** @class */ (function () {
    function RgbRenderer(renderData) {
        this.renderData = renderData;
    }
    /**
     * tranforms a color value to a rgb value
     * @param input
     * @returns
     */
    RgbRenderer.prototype.toRgb = function (input, errorType) {
        if (errorType === void 0) { errorType = "color"; }
        if (input instanceof Array)
            return (input.length < 3 ? input.concat(Array(3 - input.length).fill(0)) : input)
                .slice(0, 3)
                .map(function (v) { return Math.max(0, Math.min(255, v)); });
        if (typeof input === "string") {
            if (/^#[0-9a-fA-F]{3,6}$/.test(input)) {
                var txt = input.slice(1);
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
    };
    RgbRenderer.prototype._getCode = function (input, errorType) {
        if (errorType === void 0) { errorType = "color"; }
        return this.renderData.getCode(this.toRgb(input, errorType));
    };
    RgbRenderer.prototype.get = function (type, input) {
        return type === "front" ? this.getFront(input) : this.getBack(input);
    };
    RgbRenderer.prototype.getFront = function (input) {
        return this.renderData.getFront(this._getCode(input, "front"));
    };
    RgbRenderer.prototype.getBack = function (input) {
        return this.renderData.getBack(this._getCode(input, "back"));
    };
    return RgbRenderer;
}());
exports.RgbRenderer = RgbRenderer;
exports.rgbRenderers = {
    "256": new RgbRenderer(styl_ref_1.c256),
    "16m": new RgbRenderer(styl_ref_1.c16m),
};
var StylRenderer = /** @class */ (function () {
    function StylRenderer(joiner) {
        this.joiner = joiner;
    }
    StylRenderer.prototype.renderContents = function (contents, noContentDecode) {
        if (noContentDecode === void 0) { noContentDecode = false; }
        var rendered = this.joiner.join(contents);
        if (noContentDecode || !(contents === null || contents === void 0 ? void 0 : contents.includes("\x1B[")))
            return rendered;
        return styl_decode_1.StylDecoder.renderContents(rendered);
    };
    return StylRenderer;
}());
exports.StylRenderer = StylRenderer;
