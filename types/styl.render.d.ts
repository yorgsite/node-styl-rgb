import { RgbInputType, RgbRenderType } from "./styl.ref";
export declare class RgbRenderer {
    renderData: RgbRenderType;
    constructor(renderData: RgbRenderType);
    /**
     * tranforms a color value to a rgb value
     * @param input
     * @returns
     */
    toRgb(input: RgbInputType, errorType?: string): [number, number, number];
    private _getCode;
    get(type: "front" | "back", input: RgbInputType): string;
    getFront(input: RgbInputType): string;
    getBack(input: RgbInputType): string;
}
export type rgbType = "256" | "16m";
export declare const rgbRenderers: {
    [k in rgbType]: RgbRenderer;
};
export declare class StylRenderer {
    joiner: [string, string];
    constructor(joiner: [string, string]);
    renderContents(contents: string, noContentDecode?: boolean): string;
}
//# sourceMappingURL=styl.render.d.ts.map