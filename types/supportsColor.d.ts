export declare function createSupportsColor(stream: {
    isTTY: any;
}, options?: {}): {
    level: number;
    hasBasic: boolean;
    has256: boolean;
    has16m: boolean;
};
declare const supportsColor: {
    stdout: {
        level: number;
        hasBasic: boolean;
        has256: boolean;
        has16m: boolean;
    };
    stderr: {
        level: number;
        hasBasic: boolean;
        has256: boolean;
        has16m: boolean;
    };
};
export default supportsColor;
//# sourceMappingURL=supportsColor.d.ts.map