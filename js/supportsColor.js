"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSupportsColor = createSupportsColor;
var node_os_1 = __importDefault(require("node:os"));
var node_process_1 = __importDefault(require("node:process"));
var node_tty_1 = __importDefault(require("node:tty"));
// From: https://github.com/sindresorhus/has-flag/blob/main/index.js
/// function hasFlag(flag, argv = globalThis.Deno?.args ?? process.argv) {
function hasFlag(flag, argv) {
    if (argv === void 0) { argv = globalThis.Deno ? globalThis.Deno.args : node_process_1.default.argv; }
    var prefix = flag.startsWith("-") ? "" : flag.length === 1 ? "-" : "--";
    var position = argv.indexOf(prefix + flag);
    var terminatorPosition = argv.indexOf("--");
    return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
}
var env = node_process_1.default.env;
var flagForceColor;
if (hasFlag("no-color") ||
    hasFlag("no-colors") ||
    hasFlag("color=false") ||
    hasFlag("color=never")) {
    flagForceColor = 0;
}
else if (hasFlag("color") ||
    hasFlag("colors") ||
    hasFlag("color=true") ||
    hasFlag("color=always")) {
    flagForceColor = 1;
}
function envForceColor() {
    if (!("FORCE_COLOR" in env)) {
        return;
    }
    if (env.FORCE_COLOR === "true") {
        return 1;
    }
    if (env.FORCE_COLOR === "false") {
        return 0;
    }
    if (env.FORCE_COLOR.length === 0) {
        return 1;
    }
    var level = Math.min(Number.parseInt(env.FORCE_COLOR, 10), 3);
    if (![0, 1, 2, 3].includes(level)) {
        return;
    }
    return level;
}
function translateLevel(level) {
    if (level === 0) {
        return {
            level: level,
            hasBasic: false,
            has256: false,
            has16m: false,
        };
    }
    return {
        level: level,
        hasBasic: true,
        has256: level >= 2,
        has16m: level >= 3,
    };
}
function _supportsColor(haveStream, _a) {
    var _b = _a === void 0 ? {} : _a, streamIsTTY = _b.streamIsTTY, _c = _b.sniffFlags, sniffFlags = _c === void 0 ? true : _c;
    var noFlagForceColor = envForceColor();
    if (noFlagForceColor !== undefined) {
        flagForceColor = noFlagForceColor;
    }
    var forceColor = sniffFlags ? flagForceColor : noFlagForceColor;
    if (forceColor !== undefined) {
        return forceColor;
    }
    if (sniffFlags) {
        if (hasFlag("color=16m") || hasFlag("color=full") || hasFlag("color=truecolor")) {
            return 3;
        }
        if (hasFlag("color=256")) {
            return 2;
        }
    }
    // Check for Azure DevOps pipelines.
    // Has to be above the `!streamIsTTY` check.
    if ("TF_BUILD" in env && "AGENT_NAME" in env) {
        return 1;
    }
    if (haveStream && !streamIsTTY && forceColor === undefined) {
        return 0;
    }
    var min = 0;
    if (env.TERM === "dumb") {
        return min;
    }
    if (node_process_1.default.platform === "win32") {
        // Windows 10 build 10586 is the first Windows release that supports 256 colors.
        // Windows 10 build 14931 is the first release that supports 16m/TrueColor.
        var osRelease = node_os_1.default.release().split(".");
        if (Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) {
            return Number(osRelease[2]) >= 14931 ? 3 : 2;
        }
        return 1;
    }
    if ("CI" in env) {
        if ("GITHUB_ACTIONS" in env || "GITEA_ACTIONS" in env) {
            return 3;
        }
        if (["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "BUILDKITE", "DRONE"].some(function (sign) { return sign in env; }) ||
            env.CI_NAME === "codeship") {
            return 1;
        }
        return min;
    }
    if ("TEAMCITY_VERSION" in env) {
        return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
    }
    if (env.COLORTERM === "truecolor") {
        return 3;
    }
    if (env.TERM === "xterm-kitty") {
        return 3;
    }
    if ("TERM_PROGRAM" in env) {
        var version = Number.parseInt((env.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
        switch (env.TERM_PROGRAM) {
            case "iTerm.app": {
                return version >= 3 ? 3 : 2;
            }
            case "Apple_Terminal": {
                return 2;
            }
            // No default
        }
    }
    if (/-256(color)?$/i.test(env.TERM)) {
        return 2;
    }
    if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
        return 1;
    }
    if ("COLORTERM" in env) {
        return 1;
    }
    return min;
}
function createSupportsColor(stream, options) {
    if (options === void 0) { options = {}; }
    var level = _supportsColor(stream, __assign({ streamIsTTY: stream && stream.isTTY }, options));
    return translateLevel(level);
}
var supportsColor = {
    stdout: createSupportsColor({ isTTY: node_tty_1.default.isatty(1) }),
    stderr: createSupportsColor({ isTTY: node_tty_1.default.isatty(2) }),
};
exports.default = supportsColor;
