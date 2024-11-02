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
exports.AbstractCustomError = void 0;
var AbstractCustomError = /** @class */ (function (_super) {
    __extends(AbstractCustomError, _super);
    function AbstractCustomError(errorConstructor, callerConstructor, methodName) {
        var str = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            str[_i - 3] = arguments[_i];
        }
        return _super.call(this, AbstractCustomError.createAuto(errorConstructor, callerConstructor, methodName, str)) || this;
    }
    AbstractCustomError.createAuto = function (errorConstructor, callerConstructor, methodName, str) {
        var errs = "";
        errs += "" + errorConstructor.name;
        if (callerConstructor || methodName) {
            errs +=
                " In " +
                    (callerConstructor && methodName
                        ? callerConstructor.name + "." + methodName
                        : methodName || callerConstructor.name);
        }
        errs += " :\n";
        errs += str.map(function (s) { return (s instanceof Array ? s.join("\n") : s); }).join("\n");
        return errs;
    };
    return AbstractCustomError;
}(Error));
exports.AbstractCustomError = AbstractCustomError;
