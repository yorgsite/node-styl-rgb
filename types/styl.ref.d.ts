import { HLBaseStyleType, HLColorType } from "./styl.types";
export declare const styleRef: {
    [kk in HLBaseStyleType]: [string, string];
};
export declare const c16Ref: {
    [k in "front" | "back"]: {
        [kk in HLColorType]: [string, string];
    };
};
export type RgbRenderType = {
    getCode: (v: number[]) => string;
    getFront: (code: string) => string;
    getBack: (code: string) => string;
};
export declare const c256: {
    getCode: (rgb: number[]) => string;
    getFront: (code: string) => string;
    getBack: (code: string) => string;
};
export declare const c16m: {
    getCode: (rgb: number[]) => string;
    getFront: (code: string) => string;
    getBack: (code: string) => string;
};
export type RgbInputType = string | number | [number, number, number];
//# sourceMappingURL=styl.ref.d.ts.map