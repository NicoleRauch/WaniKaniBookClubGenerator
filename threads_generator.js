const fs = require('fs');
const possibleHeaders = require('./general').possibleHeaders;

const NEWLINE = "\n";

const log = (text) => { console.log(text); return text; };

function countOccurrences(url) {
    if (!url) { return 0; }
    return url.split("").filter(x => x === '/').length;
}

const urlPrefix = "https://community.wanikani.com/t/x/";
const urlSuffix = url => // we assume the URL is not null
        countOccurrences(url) < 2
            ? url // it already is a suffix
            : url.substring(url.lastIndexOf('/') + 1); // find and use the suffix

const urlSnippetOf = (url) =>
    // safety measurement: empty url should be caught in weekTemplate already
    url ? urlPrefix + urlSuffix(url) : "";

const urlOf = (name, url) => url ? "[" + name + "](" + urlSnippetOf(url) + ")" : name;

const toTableRow = rowElements => "| " + rowElements.join(" | ") + " |" + NEWLINE;


const headerDashesWithAlignment = theConfig => heading => {
    switch (heading) {
        case theConfig.readingPageInfoTitle:
        case theConfig.readingPageInfo2Title:
        case theConfig.readingEndPercentTitle:
        case possibleHeaders.page_count:
            return "-:"; // right-aligned
        case possibleHeaders.week:
        case possibleHeaders.start_date:
        case theConfig.readingRangeTitle:
            return ":-"; // left-aligned
        default:
            return "MISSING ALIGNMENT";
    }
};


const headerText = theConfig => {
    const headings =
        (theConfig.showWeekInfo ? [ "Week" ] : [])
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

const insert = (entry, mod = x => x) => entry ? mod(entry) : "";

const annotate = (properNounsList, note) => properNounsList.map(
    (entry, index) => index === 0 ? {...entry, notes: [].concat(entry.notes || []).concat(note).join(" ")} : entry);

const allProperNouns = (theConfig) => theConfig.weeks.reduce(
    (acc, current) => acc.concat(current.properNouns ? annotate(current.properNouns, "(Week " + current.week + ")") : []),
    theConfig.properNouns || []
);

const allProperNounsUpTo = (theConfig, theCurrentWeek) => theConfig.weeks.reduce(
    (acc, current) => current.week < theCurrentWeek
        ? { ...acc, previous: acc.previous.concat(current.properNouns ? annotate(current.properNouns, "(Week " + current.week + ")") : []) }
        : current.week === theCurrentWeek
            ? { ...acc, current: current.properNouns || [] }
            : acc,
    { previous: theConfig.properNouns || [], current: [] }
);

const unhiddenList = (nouns) =>
    "|Name|Reading|Notes|Proof|\n" +
    "|-|-|-|-|\n" +
    nouns.map(noun => ["", noun.name, noun.reading, noun.notes, noun.proof, ""].join("|")).join("\n") + "\n";


const properNounsTableForList = (nouns, hiddenLabel) => {
    const hideList = nouns.length > 8;
    return (hideList ? "[details=\"" +hiddenLabel+ "\"]\n" : "") +
        unhiddenList(nouns) +
        (hideList ? "[/details]\n" : "");
}

const properNounsTableFor = (theConfig, hiddenLabel) => properNounsTableForList(allProperNouns(theConfig), hiddenLabel);


const weeklyProperNounsTableFor = (theConfig, theCurrentWeek, hiddenLabel) => {
    const properNounsCollection = allProperNounsUpTo(theConfig, theCurrentWeek);
    return (properNounsCollection.previous.length > 0 ? properNounsTableForList(properNounsCollection.previous, hiddenLabel) : "")
    + (properNounsCollection.current.length > 0 ? unhiddenList(properNounsCollection.current) : "");
}


const weekEntry = (showWeekInfo, withLinks, hasPageInfo, hasPageInfo2, hasEndPercentage, withLinkOnReadingRange) => week => toTableRow(
    (showWeekInfo
        ? [ withLinks ? urlOf("Week " + week.week, week.weekURL) : "Week " + week.week ]
        : [])
        .concat([
            insert(week.weekStartDate),
            insert(week.readingRange, x => withLinks && withLinkOnReadingRange ? urlOf(x, week.weekURL) : x),
        ]
    )
    .concat(hasPageInfo ? insert(week.readingPageInfo) : [])
    .concat(hasPageInfo2 ? insert(week.readingPageInfo2) : [])
    .concat(hasEndPercentage ? insert(week.readingEndPercent, x => x + "%") : [])
    .concat(insert(week.readingPageCount))
);

const readingSchedule = (theConfig) => {
    const weeksText = theConfig.weeks
        .map(weekEntry(theConfig.showWeekInfo, true, !!theConfig.readingPageInfoTitle, !!theConfig.readingPageInfo2Title, !!theConfig.readingEndPercentTitle))
        .join("");
    return headerText(theConfig) + weeksText;
};

const isNumber = (n) => !isNaN(parseFloat(String(n))) && isFinite(Number(n));

const textRatioPerPageFor = (bookWalkerPages, physicalPages) => {
    if(bookWalkerPages === undefined || physicalPages === undefined || !isNumber(bookWalkerPages) || !isNumber(physicalPages)) {
        return "";
    }
    return (Number(bookWalkerPages) / Number(physicalPages) * 100).toFixed(0);
}

const weeklyReadingSchedule = (theConfig, theWeekConfig) => headerText(theConfig) +
    weekEntry(theConfig.showWeekInfo, false, !!theConfig.readingPageInfoTitle, !!theConfig.readingPageInfo2Title, !!theConfig.readingEndPercentTitle, !theConfig.linkOnlyOnWeek)(theWeekConfig);

const hasWeekURL = (theWeeks) => theWeeks === undefined ? false : theWeeks.some(week => week.weekURL);

const hasProperNouns = (theConfig) => theConfig.properNouns && theConfig.properNouns.length > 0 ||
    !!theConfig.weeks.find(week => week.properNouns && week.properNouns.length > 0);

function replaceGlobalVariables(theTemplate, theConfig) {
    theTemplate = theTemplate.replace(/\$bookClubName\$/g, theConfig.bookClubName);
    theTemplate = theTemplate.replace(/\$bookClubURL\$/g, urlSnippetOf(theConfig.bookClubURL));
    theTemplate = theTemplate.replace(/\$bookName\$/g, theConfig.bookName);
    theTemplate = theTemplate.replace(/\$bookImage\$/g, theConfig.bookImage);
    theTemplate = theTemplate.replace(/\$bookHomeThreadURL\$/g, urlSnippetOf(theConfig.bookHomeThreadURL));
    theTemplate = theTemplate.replace(/\$whereToBuy\$/g, theConfig.whereToBuy.map(({name, url}) => url ? "[" + name + "](" + url + ")" : name).join(" | ")); // no URL function!
    theTemplate = theTemplate.replace(/\$numberOfTheLastWeek\$/g, theConfig.numberOfTheLastWeek);
    theTemplate = theTemplate.replace(/\$readingPageInfoTitle\$/g, theConfig.readingPageInfoTitle);
    theTemplate = theTemplate.replace(/\$readingPageInfo2Title\$/g, theConfig.readingPageInfo2Title);
    theTemplate = theTemplate.replace(/\$readingRangeTitle\$/g, theConfig.readingRangeTitle);
    theTemplate = theTemplate.replace(/\$readingSchedule\$/g, readingSchedule(theConfig));
    theTemplate = theTemplate.replace(/\$textRatioPerPage\$/g, textRatioPerPageFor(theConfig.bookwalkerPageCount, theConfig.physicalPageCount))
    theTemplate = theTemplate.replace(/\$mainVocabURL\$/g, theConfig.mainVocabURL);
    theTemplate = theTemplate.replace(/\$hasProperNouns\$/g, hasProperNouns(theConfig));
    theTemplate = theTemplate.replace(/\$properNouns\$/g, properNounsTableFor(theConfig, "Proper Nouns"));
    theTemplate = theTemplate.replace(/\$isOnFloFlo\$/g, theConfig.isOnFloFlo);
    theTemplate = theTemplate.replace(/\$hasReadAlongSession\$/g, theConfig.hasReadAlongSession);
    theTemplate = theTemplate.replace(/\$readAlongFirstDate\$/g, theConfig.readAlongFirstDate);
    theTemplate = theTemplate.replace(/\$readAlongWeekday\$/g, theConfig.readAlongWeekday);
    theTemplate = theTemplate.replace(/\$readAlongJSTHuman\$/g, theConfig.readAlongJSTHuman);
    theTemplate = theTemplate.replace(/\$readAlongJSTComputer\$/g, theConfig.readAlongJSTComputer); // TODO
    theTemplate = theTemplate.replace(/\$readingFirstDateWithYear\$/g, theConfig.readingFirstDateWithYear || "TBA");
    theTemplate = theTemplate.replace(/\$hasStarted\$/g, hasWeekURL(theConfig.weeks));
    return theTemplate;
}

function replaceWeeklyVariables(theWeekTemplate, theWeekConfig, theConfig) {
    theWeekTemplate = theWeekTemplate.replace(/\$week\$/g, theWeekConfig.week);
    theWeekTemplate = theWeekTemplate.replace(/\$weekNumber\$/g, theWeekConfig.weekNumber || parseInt(theWeekConfig.week, 10));
    theWeekTemplate = theWeekTemplate.replace(/\$weekStartDate\$/g, theWeekConfig.weekStartDate || "");
    theWeekTemplate = theWeekTemplate.replace(/\$readingPageInfo\$/g, theWeekConfig.readingPageInfo || "");
    theWeekTemplate = theWeekTemplate.replace(/\$readingPageInfo2\$/g, theWeekConfig.readingPageInfo2 || "");
    theWeekTemplate = theWeekTemplate.replace(/\$readingEndPercent\$/g, theWeekConfig.readingEndPercent ? theWeekConfig.readingEndPercent + "%" : "");
    theWeekTemplate = theWeekTemplate.replace(/\$readingRange\$/g, theWeekConfig.readingRange || "");
    theWeekTemplate = theWeekTemplate.replace(/\$readingPageCount\$/g, theWeekConfig.readingPageCount || "");
    theWeekTemplate = theWeekTemplate.replace(/\$readAlongNextDate\$/g, theWeekConfig.readAlongNextDate);
    // generated values:
    theWeekTemplate = theWeekTemplate.replace(/\$previousWeek\$/g, weeks[theWeekConfig.weekNumber - 1] ? weeks[theWeekConfig.weekNumber - 1].week : undefined);
    theWeekTemplate = theWeekTemplate.replace(/\$nextWeek\$/g, weeks[theWeekConfig.weekNumber + 1] ? weeks[theWeekConfig.weekNumber + 1].week : undefined);
    theWeekTemplate = theWeekTemplate.replace(/\$bookPreviousWeekURL\$/g, urlSnippetOf(weeks[theWeekConfig.weekNumber - 1] ? weeks[theWeekConfig.weekNumber - 1].weekURL : undefined));
    theWeekTemplate = theWeekTemplate.replace(/\$bookNextWeekURL\$/g, urlSnippetOf(weeks[theWeekConfig.weekNumber + 1] ? weeks[theWeekConfig.weekNumber + 1].weekURL : undefined));
    theWeekTemplate = theWeekTemplate.replace(/\$weeklyReadingSchedule\$/g, weeklyReadingSchedule(theConfig, theWeekConfig));
    theWeekTemplate = theWeekTemplate.replace(/\$vocabURL\$/g, theWeekConfig.vocabURL);
    theWeekTemplate = theWeekTemplate.replace(/\$weeklyProperNouns\$/g, weeklyProperNounsTableFor(theConfig, theWeekConfig.week, "Previous Proper Nouns"));
    return theWeekTemplate;
}

function replaceConditionals(theTemplate) {
    const reducer = (acc, current) => {
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

function writeFile(fileExtension, theTemplate) {
    const resultFileName = configFileName.replace(".json", fileExtension);
    fs.writeFileSync("./" + resultFileName, theTemplate, {encoding: "utf8"});
}

///////////////////////////////////////////////////////////////////////////////////
/////////////// Processing the Configuration: /////////////////////////////////////

const configFileName = process.argv[2];
const config = JSON.parse(fs.readFileSync("./" + configFileName, {encoding: "utf8"}));
config.weeks = config.weeks.sort((a, b) => a.week - b.week); // sort the weeks for more straightforward access
// add default values:
if(config.showWeekInfo === undefined){
    config.showWeekInfo = true;
}

const weeks = config.weeks.reduce(
    (acc, current) => ({...acc, [current.week]: current}),
    {}
);

/////////// generating the home thread /////////////////////////////////////////

var homeTemplate = fs.readFileSync("./" + config.homeTemplate, {encoding: "utf8"});

homeTemplate = replaceGlobalVariables(homeTemplate, config);
homeTemplate = replaceConditionals(homeTemplate);

// next week for reading session information:
const nextReadings =
    config.hasReadAlongSession ?
        Object.values(weeks)
            .map(week => ({week: week.week, millisInFuture: Date.parse(week.readAlongNextDate) - Date.now()})) // future readings are positive
            .filter(({millisInFuture}) => millisInFuture >= 0) // remove all past readings
            .sort((a, b) => b - a)
        : [];

if(nextReadings.length) {
    homeTemplate = replaceWeeklyVariables(homeTemplate, weeks[nextReadings[0].week], config);
}

writeFile("_home.md", homeTemplate);


/////////// generating the weekly threads /////////////////////////////////////////

config.weeks.map(weekConfig => {

    // reload the template for each week!
    var weekTemplate = fs.readFileSync("./" + config.weekTemplate, {encoding: "utf8"});

    weekTemplate = replaceGlobalVariables(weekTemplate, config);
    weekTemplate = replaceWeeklyVariables(weekTemplate, weekConfig, config);
    weekTemplate = replaceConditionals(weekTemplate);

    writeFile("_" + (config.showWeekInfo ? "week" : "") + weekConfig.week + ".md", weekTemplate);
});
