import {Decoder, Validation} from "io-ts";
import {PathReporter} from "io-ts/lib/PathReporter";
import { isRight } from 'fp-ts/Either';
import {none, Option, some} from "fp-ts/Option";
import {logToConsole} from "./logHelper";

export const validiere = <T>(
    zuValidieren: Record<string, string>,
    iotsType: Decoder<Record<string, string>, T>,
    logMessage: string,
    callback: (x: Option<T>) => void): void => {
    const result: Validation<T> = iotsType.decode(zuValidieren);
    logToConsole(logMessage, PathReporter.report(result));
    if (isRight(result)) {
        callback(some(result.right));
    } else {
        callback(none); // Fehlerbehandlung nach außen
    }
};
