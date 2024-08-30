import * as R from "ramda";

import {ICollectedProperNouns, IConfig, IOConfig, IProperNoun, IReading, IWeekConfig, IWhereToBuy, POSSIBLE_HEADERS} from "./zz_src/general";
import {validiere} from "./zz_src/validiere";
import {fold} from "fp-ts/Option";

const fs = require("fs");

const NEWLINE = "\n";

function countOccurrences(url: string): number {
    if (!url) {
        return 0;
    }
    return url.split("").filter(x => x === "/").length;
}

const urlPrefix = "https://community.wanikani.com/t/x/";
const urlSuffix = (url: string): string => // we assume the URL is not null
    countOccurrences(url) < 2
    ? url // it already is a suffix
    : url.substring(url.lastIndexOf("/") + 1); // find and use the suffix

const urlSnippetOf = (url: string): string =>
    // safety measurement: empty url should be caught in weekTemplate already
    url
        ? url.startsWith("http") ? url : urlPrefix + urlSuffix(url)
        : "";

const urlOf = (name: string, url: string): string => url ? "[" + name + "](" + urlSnippetOf(url) + ")" : name;

const toTableRow = (rowElements: string[]): string => "| " + rowElements.join(" | ") + " |" + NEWLINE;


const headerDashesWithAlignment = (theConfig: IConfig) => (heading: string): string => {
    switch (heading) {
        case theConfig.readingPageInfoTitle:
        case theConfig.readingPageInfo2Title:
        case theConfig.readingEndPercentTitle:
        case POSSIBLE_HEADERS.page_count:
            return "-:"; // right-aligned
        case POSSIBLE_HEADERS.week:
        case POSSIBLE_HEADERS.start_date:
        case theConfig.readingRangeTitle:
            return ":-"; // left-aligned
        default:
            return "MISSING ALIGNMENT";
    }
};


const headerText = (theConfig: IConfig): string => {
    const headings =
        (theConfig.showWeekInfo ? ["Week"] : [])
            .concat([
                "Start Date",
                theConfig.readingRangeTitle,
            ])
            .concat(theConfig.readingPageInfoTitle || [])
            .concat(theConfig.readingPageInfo2Title || [])
            .concat(theConfig.readingEndPercentTitle || [])
            .concat("Page Count");
    return toTableRow(headings) + toTableRow(headings.map(headerDashesWithAlignment(theConfig)));
};

const insert = <T extends string | number | undefined>(
    entry: T,
    mod: (_: T) => string = x => x === undefined ? "" : x.toString()
): string =>
    entry ? mod(entry) : "";

const box = (x: string | undefined): string[] => x === undefined ? [] : [x];

const annotate = (properNounsList: IProperNoun[], note: string): IProperNoun[] => properNounsList.map(
    (entry: IProperNoun, index: number) => index === 0 ? {...entry, notes: box(entry.notes).concat(box(note)).join(" ")} : entry);

const allProperNouns = (theConfig: IConfig): IProperNoun[] => theConfig.weeks.reduce(
    (acc, current) => acc.concat(current.properNouns ? annotate(current.properNouns, "(Week " + current.week + ")") : []),
    theConfig.properNouns || []
);

const allProperNounsUpTo = (theConfig: IConfig, theCurrentWeek: number): ICollectedProperNouns =>
    theConfig.weeks.reduce(
        (acc: ICollectedProperNouns, current: IWeekConfig) => current.weekNumber < theCurrentWeek
                                                              ? {...acc, previous: acc.previous.concat(current.properNouns ? annotate(current.properNouns, "(Week " + current.week + ")") : [])}
                                                              : current.weekNumber === theCurrentWeek
                                                                ? {...acc, current: current.properNouns || []}
                                                                : acc,
        {previous: theConfig.properNouns || [], current: []}
    );

const spoilered = (note: string | undefined): string =>
    note === undefined || note.length === 0 ? "" : `[spoiler]${note}[/spoiler]`;

const unhiddenList = (nouns: IProperNoun[], spoilerFunc: (_: string | undefined) => string | undefined): string =>
    "|Name|Reading|Notes|Proof|\n" +
    "|-|-|-|-|\n" +
    nouns.map((noun: IProperNoun) => ["", noun.name, noun.reading, spoilerFunc(noun.notes), noun.proof, ""].join("|")).join("\n") + "\n";


const properNounsTableForList = (nouns: IProperNoun[], hiddenLabel: string): string => {
    const hideList = nouns.length > 0;
    return (hideList ? "[details=\"" + hiddenLabel + "\"]\n" : "") +
        unhiddenList(nouns, R.identity) +
        (hideList ? "[/details]\n" : "");
};

const properNounsTableFor = (theConfig: IConfig, hiddenLabel: string): string => properNounsTableForList(allProperNouns(theConfig), hiddenLabel);


const weeklyProperNounsTableFor = (theConfig: IConfig, theCurrentWeek: number, hiddenLabel: string): string => {
    const properNounsCollection = allProperNounsUpTo(theConfig, theCurrentWeek);
    return (properNounsCollection.previous.length > 0 ? properNounsTableForList(properNounsCollection.previous, hiddenLabel) : "")
        + (properNounsCollection.current.length > 0 ? unhiddenList(properNounsCollection.current, spoilered) : "");
};


const weekEntry = (showWeekInfo: boolean, withLinks: boolean, hasPageInfo: boolean, hasPageInfo2: boolean,
                   hasEndPercentage: boolean, withLinkOnReadingRange: boolean) => (week: IWeekConfig): string =>
    toTableRow(
        (showWeekInfo
         ? [withLinks ? urlOf("Week " + week.week, week.weekURL) : "Week " + week.week]
         : []
        )
            .concat([
                insert(week.weekStartDate),
                insert(week.readingRange, (x: string) => (withLinks && withLinkOnReadingRange) ? urlOf(x, week.weekURL) : x),
            ])
            .concat(hasPageInfo ? insert(week.readingPageInfo) : [])
            .concat(hasPageInfo2 ? insert(week.readingPageInfo2) : [])
            .concat(hasEndPercentage ? insert(week.readingEndPercent, x => x + "%") : [])
            .concat(insert(week.readingPageCount))
    );

const readingSchedule = (theConfig: IConfig): string => {
    const weeksText: string = theConfig.weeks
                                       .map(weekEntry(theConfig.showWeekInfo, true, !!theConfig.readingPageInfoTitle, !!theConfig.readingPageInfo2Title, !!theConfig.readingEndPercentTitle, !theConfig.linkOnlyOnWeek))
                                       .join("");
    return headerText(theConfig) + weeksText;
};

const isNumber = (n: unknown): boolean => !isNaN(parseFloat(String(n))) && isFinite(Number(n));

const textRatioPerPageFor = (bookWalkerPages: string, physicalPages: string): string => {
    if (bookWalkerPages === undefined || physicalPages === undefined || !isNumber(bookWalkerPages) || !isNumber(physicalPages)) {
        return "";
    }
    return (Number(bookWalkerPages) / Number(physicalPages) * 100).toFixed(0);
};

const weeklyReadingSchedule = (theConfig: IConfig, theWeekConfig: IWeekConfig): string => headerText(theConfig) +
    weekEntry(theConfig.showWeekInfo, false, !!theConfig.readingPageInfoTitle, !!theConfig.readingPageInfo2Title, !!theConfig.readingEndPercentTitle, !theConfig.linkOnlyOnWeek)(theWeekConfig);

const hasWeekURL = (theWeeks: IWeekConfig[]): boolean => theWeeks === undefined ? false : theWeeks.some(week => week.weekURL);

const hasProperNouns = (theConfig: IConfig): boolean => theConfig.properNouns && theConfig.properNouns.length > 0 ||
    !!theConfig.weeks.find(week => week.properNouns && week.properNouns.length > 0);

function replaceGlobalVariables(theTemplate: string, theConfig: IConfig): string {
    theTemplate = theTemplate.replace(/\$bookClubName\$/g, theConfig.bookClubName);
    theTemplate = theTemplate.replace(/\$bookClubURL\$/g, urlSnippetOf(theConfig.bookClubURL));
    theTemplate = theTemplate.replace(/\$bookName\$/g, theConfig.bookName);
    theTemplate = theTemplate.replace(/\$bookImage\$/g, theConfig.bookImage);
    theTemplate = theTemplate.replace(/\$bookHomeThreadURL\$/g, urlSnippetOf(theConfig.bookHomeThreadURL));
    theTemplate = theTemplate.replace(/\$whereToBuy\$/g, theConfig.whereToBuy.map(({name, url}: IWhereToBuy) => url ? "[" + name + "](" + url + ")" : name).join(" | ")); // no URL function!
    theTemplate = theTemplate.replace(/\$nativelyPage\$/g, theConfig.nativelyPage.toString());
    theTemplate = theTemplate.replace(/\$numberOfTheLastWeek\$/g, theConfig.numberOfTheLastWeek.toString());
    theTemplate = theTemplate.replace(/\$readingPageInfoTitle\$/g, theConfig.readingPageInfoTitle || "");
    theTemplate = theTemplate.replace(/\$readingPageInfo2Title\$/g, theConfig.readingPageInfo2Title || "");
    theTemplate = theTemplate.replace(/\$readingRangeTitle\$/g, theConfig.readingRangeTitle || "");
    theTemplate = theTemplate.replace(/\$readingSchedule\$/g, readingSchedule(theConfig));
    theTemplate = theTemplate.replace(/\$textRatioPerPage\$/g, textRatioPerPageFor(theConfig.bookwalkerPageCount, theConfig.physicalPageCount));
    theTemplate = theTemplate.replace(/\$mainVocabURL\$/g, theConfig.mainVocabURL);
    theTemplate = theTemplate.replace(/\$hasProperNouns\$/g, hasProperNouns(theConfig).toString());
    theTemplate = theTemplate.replace(/\$properNouns\$/g, properNounsTableFor(theConfig, "Proper Nouns"));
    theTemplate = theTemplate.replace(/\$isOnFloFlo\$/g, theConfig.isOnFloFlo.toString());
    theTemplate = theTemplate.replace(/\$hasReadAlongSession\$/g, theConfig.hasReadAlongSession.toString());
    theTemplate = theTemplate.replace(/\$readAlongFirstDate\$/g, theConfig.readAlongFirstDate);
    theTemplate = theTemplate.replace(/\$readAlongWeekday\$/g, theConfig.readAlongWeekday);
    theTemplate = theTemplate.replace(/\$readAlongJSTHuman\$/g, theConfig.readAlongJSTHuman);
    theTemplate = theTemplate.replace(/\$readAlongJSTComputer\$/g, theConfig.readAlongJSTComputer); // TODO
    theTemplate = theTemplate.replace(/\$readingFirstDateWithYear\$/g, theConfig.readingFirstDateWithYear || "TBA");
    theTemplate = theTemplate.replace(/\$hasStarted\$/g, hasWeekURL(theConfig.weeks).toString());
    return theTemplate;
}

function replaceWeeklyVariables(theWeekTemplate: string, theWeekConfig: IWeekConfig, theConfig: IConfig): string {
    const weeks = weeksFor(theConfig);
    theWeekTemplate = theWeekTemplate.replace(/\$week\$/g, theWeekConfig.week);
    theWeekTemplate = theWeekTemplate.replace(/\$weekNumber\$/g, (theWeekConfig.weekNumber || parseInt(theWeekConfig.week, 10)).toString(10));
    theWeekTemplate = theWeekTemplate.replace(/\$weekStartDate\$/g, theWeekConfig.weekStartDate || "");
    theWeekTemplate = theWeekTemplate.replace(/\$readingPageInfo\$/g, theWeekConfig.readingPageInfo || "");
    theWeekTemplate = theWeekTemplate.replace(/\$readingPageInfo2\$/g, theWeekConfig.readingPageInfo2 || "");
    theWeekTemplate = theWeekTemplate.replace(/\$readingEndPercent\$/g, theWeekConfig.readingEndPercent ? theWeekConfig.readingEndPercent + "%" : "");
    theWeekTemplate = theWeekTemplate.replace(/\$readingRange\$/g, theWeekConfig.readingRange || "");
    theWeekTemplate = theWeekTemplate.replace(/\$readingPageCount\$/g, theWeekConfig.readingPageCount || "");
    theWeekTemplate = theWeekTemplate.replace(/\$readAlongNextDate\$/g, theWeekConfig.readAlongNextDate);
    // generated values:
    theWeekTemplate = theWeekTemplate.replace(/\$previousWeek\$/g, weeks[theWeekConfig.weekNumber - 1]?.week || "");
    theWeekTemplate = theWeekTemplate.replace(/\$nextWeek\$/g, weeks[theWeekConfig.weekNumber + 1]?.week || "");
    theWeekTemplate = theWeekTemplate.replace(/\$bookPreviousWeekURL\$/g, urlSnippetOf(weeks[theWeekConfig.weekNumber - 1]?.weekURL || ""));
    theWeekTemplate = theWeekTemplate.replace(/\$bookNextWeekURL\$/g, urlSnippetOf(weeks[theWeekConfig.weekNumber + 1]?.weekURL || ""));
    theWeekTemplate = theWeekTemplate.replace(/\$weeklyReadingSchedule\$/g, weeklyReadingSchedule(theConfig, theWeekConfig));
    theWeekTemplate = theWeekTemplate.replace(/\$vocabURL\$/g, theWeekConfig.vocabURL);
    theWeekTemplate = theWeekTemplate.replace(/\$weeklyProperNouns\$/g, weeklyProperNounsTableFor(theConfig, theWeekConfig.weekNumber, "Previous Proper Nouns"));
    return theWeekTemplate;
}

function replaceConditionals(theTemplate: string): string {
    type AccLines = {
        removeLines: boolean,
        resultLines: string[]
    }
    const reducer = (acc: AccLines, current: string) => {
        if (current.startsWith("::if")) {
            const condition = eval(current.substring(4));
            return {...acc, removeLines: !condition}; // ignore ::if line, set whether to remove lines or not
        }
        if (current.startsWith("::else")) {
            return {...acc, removeLines: !acc.removeLines}; // ignore ::else line, invert the removeLines condition
        }
        if (current.startsWith("::endif")) {
            return {...acc, removeLines: false}; // ignore ::endif line, reset back to normal
        }
        if (acc.removeLines) {
            return acc; // ignore current line
        }
        return {...acc, resultLines: acc.resultLines.concat(current)}; // add current line
    };

    return theTemplate.split(NEWLINE).reduce(
        reducer,
        {
            removeLines: false,
            resultLines: []
        }
    ).resultLines.join(NEWLINE);
}

function writeFile(fileExtension: string, theTemplate: string): void {
    const resultFileName = configFileName.replace(".json", fileExtension);
    fs.writeFileSync("./" + resultFileName, theTemplate, {encoding: "utf8"});
}

const weeksFor = (config: IConfig): Record<number, IWeekConfig> => config.weeks.reduce(
    (acc, current) => ({...acc, [current.weekNumber]: current}),
    {}
);

///////////////////////////////////////////////////////////////////////////////////
/////////////// Processing the Configuration: /////////////////////////////////////

const configFileName: string = process.argv[2] || "";
const config: Record<string, string> = JSON.parse(fs.readFileSync("./" + configFileName, {encoding: "utf8"}));


validiere<IConfig>(config, IOConfig, "Laden der Konfiguration", fold(
    () => {
    },
    (existingConfig: IConfig) => {


        existingConfig.weeks = existingConfig.weeks.sort((a, b) => a.weekNumber - b.weekNumber); // sort the weeks for more straightforward access
// add default values:
        if (existingConfig.showWeekInfo === undefined) {
            existingConfig.showWeekInfo = true;
        }

/////////// generating the home thread /////////////////////////////////////////

        var homeTemplate: string = fs.readFileSync("./" + existingConfig.homeTemplate, {encoding: "utf8"});

        homeTemplate = replaceGlobalVariables(homeTemplate, existingConfig);
        homeTemplate = replaceConditionals(homeTemplate);

        // next week for reading session information:
        const nextReadings: IReading[] =
            existingConfig.hasReadAlongSession ?
            Object.values(weeksFor)
                  .map((week: IWeekConfig) => ({weekNumber: week.weekNumber, millisInFuture: Date.parse(week.readAlongNextDate) - Date.now()})) // future readings are positive
                  .filter(({millisInFuture}) => millisInFuture >= 0) // remove all past readings
                  .sort(({millisInFuture: a}, {millisInFuture: b}) => b - a) // sort by time
                                               : [];

        const existingWeeks = weeksFor(existingConfig);
        const nextReading: IReading | undefined = nextReadings[0];
        if (nextReading !== undefined) {
            let theWeekConfig: IWeekConfig | undefined = existingWeeks[nextReading.weekNumber];
            if (theWeekConfig !== undefined) {
                homeTemplate = replaceWeeklyVariables(homeTemplate, theWeekConfig, existingConfig);
            }
        }

        writeFile("_home.md", homeTemplate);

        /////////// generating the weekly threads /////////////////////////////////////////
        existingConfig.weeks.forEach((weekConfig: IWeekConfig): void => {

            // reload the template for each week to get rid of the already filled values!
            let weekTemplate = fs.readFileSync("./" + existingConfig.weekTemplate, {encoding: "utf8"});

            weekTemplate = replaceGlobalVariables(weekTemplate, existingConfig);
            weekTemplate = replaceWeeklyVariables(weekTemplate, weekConfig, existingConfig);
            weekTemplate = replaceConditionals(weekTemplate);

            writeFile("_" + (existingConfig.showWeekInfo ? "week" : "") + weekConfig.week + ".md", weekTemplate);
        });

    }));
