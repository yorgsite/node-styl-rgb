import { RgbInputType } from "./styl.ref";
import { rgbType, StylRenderer } from "./styl.render";
import { HLBaseStyleType } from "./styl.types";
export declare class StylData {
    front: RgbInputType | null;
    back: RgbInputType | null;
    styles: Map<HLBaseStyleType, boolean>;
    clone(): StylData;
}
export declare class StylIO {
    rgbType: rgbType;
    private data;
    private renderer;
    constructor(rgbType?: rgbType);
    front(input: RgbInputType | null, v2?: number, v3?: number): void;
    back(input: RgbInputType | null, v2?: number, v3?: number): void;
    style(value: string | string[]): this;
    renderFB(joiner: [string, string], type: "front" | "back", input: RgbInputType | null): void;
    renderStyle(joiner: [string, string]): void;
    renderJoiner(): [string, string];
    render(): StylRenderer;
}
export type ParseCallbackDataType = {
    col: number;
    row: number;
    colP: number;
    rowP: number;
    width: number;
    height: number;
    rowWidth: number;
    char: string;
    styl: Styl;
};
export declare class Styl {
    contents: string;
    noContentDecode: boolean;
    private _io;
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
    constructor(rgbType: rgbType, contents?: string, noContentDecode?: boolean);
    /**
     * Sets front color
     * @param input standard or custom front rgb color value or number (red channel 0-255) if v2 & v3 are numbers
     * @param v2 green channel 0-255
     * @param v3 blue channel 0-255
     * @returns
     */
    front(input: RgbInputType | null, v2?: number, v3?: number): Styl;
    /**
     * Sets background color
     * @param input standard or custom background rgb color value or number (red channel 0-255) if v2 & v3 are numbers
     * @param v2 green channel 0-255
     * @param v3 blue channel 0-255
     * @returns
     */
    back(input: RgbInputType | null, v2?: number, v3?: number): Styl;
    style(value: string | string[]): Styl;
    /**
     * Sets a new content
     * @param text
     */
    string(text: string): this;
    /**
     *
     * @param callback
     * @returns
     */
    gradient(callback: (v: ParseCallbackDataType) => void): string;
    toString(): string;
    get b(): Styl;
    get bold(): Styl;
    get i(): Styl;
    get italic(): Styl;
    get u(): Styl;
    get underline(): Styl;
    get inverse(): Styl;
    get blink(): Styl;
    get hidden(): Styl;
    get s(): Styl;
    get strikethrough(): Styl;
    get white(): Styl;
    get grey(): Styl;
    get black(): Styl;
    get blue(): Styl;
    get cyan(): Styl;
    get green(): Styl;
    get magenta(): Styl;
    get red(): Styl;
    get yellow(): Styl;
    get whiteBG(): Styl;
    get greyBG(): Styl;
    get blackBG(): Styl;
    get blueBG(): Styl;
    get cyanBG(): Styl;
    get greenBG(): Styl;
    get magentaBG(): Styl;
    get redBG(): Styl;
    get yellowBG(): Styl;
    get text(): string;
    get theme(): (str: string) => string;
    static none(txt: string): string;
}
export interface stylType {
    /**
     * returns a Styl instance with witch you can chain colors an style for cli terminal
     * Ex : console.log('This text is '+styl('red').red.bold.uderline+' or '+styl(' dark gren ').front('#457105').whilteBG);
     * See more in Styl constructor.
     * @param contents some text
     * @param noContentDecode default=false see Styl constructor.
     * @returns
     */
    (contents?: string, noContentDecode?: boolean): Styl;
    none(txt: string): string;
    demo(): void;
    rgbType: rgbType;
}
export declare const c16m: stylType;
export declare const c256: stylType;
export declare const styl: stylType;
//# sourceMappingURL=styl.core.d.ts.map