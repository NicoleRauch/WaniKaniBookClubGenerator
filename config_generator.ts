import * as R from "ramda";
const fs = require('fs');
import * as L from "luxon";

import {validiere} from "./zz_src/validiere";
import {isUnderline, trim} from "./zz_src/generalHelper";

import {
    IColumnLayout,
    IConfig,
    INonWeeksConfig,
    IOConfig,
    IWeekConfig,
    POSSIBLE_HEADERS
} from "./zz_src/general";
import {fold} from "fp-ts/Option";

// MD File laden:
const weeklyBreakdownFile: string = process.argv[2] || "";
const tableRows: string[] = fs.readFileSync("./" + weeklyBreakdownFile, {encoding: "utf8"}).split("\n").map((x: string) => x.trim());

// Erstellen einer neuen (Dummy-)Konfiguration:
if(!isUnderline(tableRows[1])){
    console.log("The table header underline must only contain | - and whitespace");
    console.log("But the file's second row looks like this:");
    console.log(tableRows[1]);
    console.log("Make sure to use a .md file containting the weekly schedule with the config generator.")
    process.exit(0);
}

const splitRow = (row: string): string[] => {
    const firstSplit = row.split("|").map(x => x.trim());
    // only throw away empty entries at the start and the end, not in the middle!
    return firstSplit.slice(1, firstSplit.length-1);
};

const columnLayoutFor = (header: string | undefined): Partial<IColumnLayout> => {

    const addColumnInfo = (acc: Partial<IColumnLayout>, current: string, index: number): Partial<IColumnLayout> => {
        switch (current) {
            case POSSIBLE_HEADERS.week: return {...acc, week: index};
            case POSSIBLE_HEADERS.start_date: return {...acc, weekStartDate: index};

            case POSSIBLE_HEADERS.end_percentage:
            case POSSIBLE_HEADERS.kindle_percentage:
                return {...acc, readingEndPercent: index, readingEndPercentTitle: current};

            case POSSIBLE_HEADERS.page_count: return {...acc, readingPageCount: index};

            case POSSIBLE_HEADERS.pages:
            case POSSIBLE_HEADERS.end_page:
            case POSSIBLE_HEADERS.start_page:
            case POSSIBLE_HEADERS.pages_old:
            case POSSIBLE_HEADERS.page_numbers:
            case POSSIBLE_HEADERS.pages_physical:
            case POSSIBLE_HEADERS.pages_1951:
                return {...acc, readingPageInfo: index, readingPageInfoTitle: current};

            case POSSIBLE_HEADERS.pages_collectors:
            case POSSIBLE_HEADERS.pages_ebook:
            case POSSIBLE_HEADERS.kindle_loc:
            case POSSIBLE_HEADERS.pages_2013:
                return {...acc, readingPageInfo2: index, readingPageInfo2Title: current};

            case POSSIBLE_HEADERS.end_phrase:
            case POSSIBLE_HEADERS.start_chapter:
            case POSSIBLE_HEADERS.end_chapter:
            case POSSIBLE_HEADERS.chapter:
            case POSSIBLE_HEADERS.chapters:
            case POSSIBLE_HEADERS.chapter_end_phrase:
            case POSSIBLE_HEADERS.chapter_names:
                return {...acc, readingRange: index, readingRangeTitle: current};

            default:
                console.log("Unknown column header '" +current+ "' - column will be ignored.");
                return {}; // FIXME
        }
    };

    const columnTitles: string[] = header === undefined ? [] : splitRow(header);
    return R.reduce<string, [Partial<IColumnLayout>, number]>(
        ([acc, index]: [Partial<IColumnLayout>, number], current: string) =>
            [addColumnInfo(acc, current, index), index + 1],
        [{}, 0],
        columnTitles
    )[0];
};

const tableBody = tableRows.slice(2).filter(x => x.trim()); // only non-empty lines!


const fieldOfColumn = (fields: string[], column: number | undefined): string | undefined =>
    column === undefined ? undefined : fields[column];

const parse = (input: string | undefined): number | undefined =>
    input === undefined || input === "" ? undefined : parseInt(input, 10);

const weeksConfig = (existingWeeksConfig: Record<string, IWeekConfig>, columns: Partial<IColumnLayout>, firstWeekDate: L.DateTime | null): [IWeekConfig[], number] => {

    let numberOfTheLastWeek: number = 0;
    const configs: IWeekConfig[] = tableBody.map((row: string, rowIndex: number): IWeekConfig => {
        const weekNumber: number = rowIndex + 1;
        const fields: string[] = splitRow(row);
        const week: string = trim(fieldOfColumn(fields, columns.week)).split(" ").reverse()[0] || weekNumber.toString(10);
        if(weekNumber > numberOfTheLastWeek){
            numberOfTheLastWeek = weekNumber;
        }
        return {
            week,
            weekNumber,
            weekStartDate: fieldOfColumn(fields, columns.weekStartDate) ||
                (firstWeekDate !== null ? firstWeekDate.plus({days: 7 * rowIndex}).toFormat("LLL dd") : "TBA"),
            weekURL: existingWeeksConfig[weekNumber] ? existingWeeksConfig[weekNumber]?.weekURL || "" : "",
            vocabURL: existingWeeksConfig[weekNumber] ? existingWeeksConfig[weekNumber]?.vocabURL || "" : "",
            readingPageInfo: fieldOfColumn(fields, columns.readingPageInfo),
            readingPageInfo2: fieldOfColumn(fields, columns.readingPageInfo2),
            readingEndPercent: parse(fieldOfColumn(fields, columns.readingEndPercent)),
            readingRange: fieldOfColumn(fields, columns.readingRange) || "", // must not be empty
            readingPageCount: fieldOfColumn(fields, columns.readingPageCount),
            readAlongNextDate: existingWeeksConfig[weekNumber] ? existingWeeksConfig[weekNumber]?.readAlongNextDate || "" : "",
            properNouns: existingWeeksConfig[weekNumber] ? existingWeeksConfig[weekNumber]?.properNouns || [] : []
        };
    });

    return [configs, numberOfTheLastWeek];
}

const dummyConfig = (columns: Partial<IColumnLayout>): INonWeeksConfig => ({
    homeTemplate: "../home_template.md",
    weekTemplate: "../week_template.md",
    bookClubName: "",
    bookClubURL: "",
    bookName: "",
    bookImage: "",
    bookHomeThreadURL: "",
    whereToBuy: [],
    nativelyPage: "",
    physicalPageCount: "",
    bookwalkerPageCount: "",
    readingFirstDateWithYear: "",
    readingPageInfoTitle: columns.readingPageInfoTitle,
    readingPageInfo2Title: columns.readingPageInfo2Title,
    readingEndPercentTitle: columns.readingEndPercentTitle,
    readingRangeTitle: columns.readingRangeTitle || "", // must not be undefined
    linkOnlyOnWeek: false,
    mainVocabURL: "",
    properNouns: [],
    isOnFloFlo: false,
    hasReadAlongSession: false,
    readAlongFirstDate: "",
    readAlongWeekday: "Sunday",
    readAlongJSTHuman: "9:30pm",
    readAlongJSTComputer: "21:30:00",
    showWeekInfo: true,
    numberOfTheLastWeek: 0,
});

// Laden der vorhandenen Konfiguration oder Verwenden der neuen Dummy-Konfiguration, falls noch keine vorhanden:
const configFileName: string = weeklyBreakdownFile.replace(".md", ".json");
const columns: Partial<IColumnLayout> = columnLayoutFor(tableRows[0]);
const [weeks, numberOfTheLastWeek]: [IWeekConfig[], number] = weeksConfig({}, columns, null);
const geladeneConfig: Record<string, string> = fs.existsSync(configFileName) ? JSON.parse(fs.readFileSync("./" + configFileName, {encoding: "utf8"})) :
    {...dummyConfig(columns), numberOfTheLastWeek, weeks};

// //////////////////////////////////////////////////////////////////////////////////////////
validiere<IConfig>(geladeneConfig, IOConfig, "Laden der Konfiguration", fold(
    () => {},
    (existingConfig: IConfig) => {

        const existingWeeksConfig: Record<string, IWeekConfig> = existingConfig.weeks ?
            existingConfig.weeks.reduce(
                (acc, current) => ({...acc, [current.week]: current}), // FIXME nicht weekNumber?
                {}
            )
            : {};

        const firstWeekDate = L.DateTime.fromFormat(existingConfig.readingFirstDateWithYear, "DDD") // localized date with full month
        const [weeks, numberOfTheLastWeek]: [IWeekConfig[], number] = weeksConfig(existingWeeksConfig, columns, firstWeekDate.isValid ? firstWeekDate : null);
        const fullConfig: IConfig = {...dummyConfig(columns), ...existingConfig, numberOfTheLastWeek, weeks};

        fs.writeFileSync("./" + configFileName, JSON.stringify(fullConfig, null, 4) + "\n", {encoding: "utf8"});

    })
);


