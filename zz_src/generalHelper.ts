export const isUnderline = (str: string | undefined): boolean =>
    str === undefined
    ? false
    : str.replace(/\|/g, "").replace(/-/g, "").replace(/ /g, "") === "";

export const trim = (e: string | undefined): string => (e || "").trim();
