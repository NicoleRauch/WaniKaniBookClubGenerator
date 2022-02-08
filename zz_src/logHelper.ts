
export const logToConsole = (...args: unknown[]): void => { console.log(...args); } // eslint-disable-line no-console

export const logAndReturn = <T>(text: T): T => { console.log(text); return text; };

