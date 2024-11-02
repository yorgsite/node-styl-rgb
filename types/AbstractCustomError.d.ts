export declare class AbstractCustomError extends Error {
    constructor(errorConstructor: {
        new (...str: string[]): any;
    }, callerConstructor: {
        new (...args: any[]): any;
    } | null, methodName: string | null, ...str: (string | string[])[]);
    static createAuto(errorConstructor: {
        new (...str: string[]): any;
    }, callerConstructor: {
        new (...args: any[]): any;
    } | null, methodName: string | null, str: (string | string[])[]): string;
}
//# sourceMappingURL=AbstractCustomError.d.ts.map