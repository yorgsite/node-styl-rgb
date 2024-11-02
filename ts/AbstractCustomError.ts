export class AbstractCustomError extends Error {
	constructor(
		errorConstructor: { new (...str: string[]): any },
		callerConstructor: { new (...args: any[]): any } | null,
		methodName: string | null,
		...str: (string | string[])[]
	) {
		super(AbstractCustomError.createAuto(errorConstructor, callerConstructor, methodName, str));
	}
	public static createAuto(
		errorConstructor: { new (...str: string[]): any },
		callerConstructor: { new (...args: any[]): any } | null,
		methodName: string | null,
		str: (string | string[])[]
	) {
		let errs = "";
		errs += "" + errorConstructor.name;
		if (callerConstructor || methodName) {
			errs +=
				" In " +
				(callerConstructor && methodName
					? callerConstructor.name + "." + methodName
					: methodName || callerConstructor.name);
		}
		errs += " :\n";
		errs += str.map(s => (s instanceof Array ? s.join("\n") : s)).join("\n");
		return errs;
	}
}
