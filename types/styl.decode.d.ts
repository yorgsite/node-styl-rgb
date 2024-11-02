export declare class StylDecoderTag {
    type: string;
    tagName: string;
    value: string | number[];
    pileType?: "open" | "close";
    code?: string;
    constructor(type: string, tagName: string, value: string | number[], pileType?: "open" | "close", code?: string);
    clone(): StylDecoderTag;
}
export declare class StylDecoder {
    baseRef: Map<string, StylDecoderTag>;
    constructor();
    private extractNumKey;
    getTags(input: string): StylDecoderTag[];
    private static _instance;
    static get instance(): StylDecoder;
    /**
     * Rearange contents to prevent recursive changes of value to break the parent value when it closes.
     * @param contents
     * @returns
     */
    static renderContents(contents: string): string;
}
export declare class ParseCharCallbackData {
    col: number;
    row: number;
    char: string;
    rows: string[];
    width: number;
    constructor(col: number, row: number, char: string, rows: string[]);
}
export declare class ParseCharCallbackDataType {
    width: number;
    height: number;
    col: number;
    row: number;
    char: string;
    rows: string[];
}
//# sourceMappingURL=styl.decode.d.ts.map