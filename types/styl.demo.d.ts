import { stylType } from "./styl.core";
import { rgbType } from "./styl.render";
export declare class StylDemo {
    demoList: ((styl: stylType) => void)[];
    private _codeThemes?;
    private _codeLogs?;
    constructor();
    demo(styl: stylType): void;
    getCodeTheme(rgbType: rgbType): {
        [k: string]: DemoTheme;
    };
    getCodeLogs(styl: stylType): string[];
    private static _instance;
    static get instance(): StylDemo;
    static demo(styl: stylType): void;
}
declare class DemoTheme {
    theme: (v: string) => string;
    reg: RegExp;
    tr: (v: string) => string;
    constructor(theme: (v: string) => string, reg: RegExp, tr?: (v: string) => string);
}
export {};
//# sourceMappingURL=styl.demo.d.ts.map