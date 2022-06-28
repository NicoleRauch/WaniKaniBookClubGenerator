import {Context, Decoder, Validation} from "io-ts";
import {PathReporter} from "io-ts/lib/PathReporter";
import { isRight } from 'fp-ts/Either';
import {none, Option, some} from "fp-ts/Option";
import {logToConsole} from "./logHelper";
import * as R from "ramda";

const logFehlerhaftenDatensatz = (context: Context): void => {
    if(context.length === 0){
        return;
    }
    const fehlerhaftesFeld = R.takeLast(1, context)[0]?.key;
    const umgebendeDaten = R.takeLast(2, context)[0]?.actual;
    logToConsole("Fehlerhafter Datensatz:", fehlerhaftesFeld, umgebendeDaten)
}

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
        result.left.map(x => logFehlerhaftenDatensatz(x.context))
        callback(none); // Fehlerbehandlung nach außen
    }
};
