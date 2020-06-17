const fs = require('fs');
const path = require('path');

const NEWLINE = "\n";

const urlSnippetOf = (url) =>
    // safety measurement: empty url should be caught in weekTemplate already
    url ? "https://community.wanikani.com/t/x/" + url.substring(url.lastIndexOf('/') + 1) : "";

const urlOf = (name, url) => url ? "[" + name + "](" + urlSnippetOf(url) + ")" : name;

function weeklyBreakdown(theConfig) {
    const headerText = "| Week | Start Date | "
        + theConfig.readingRangeTitle + " | "
        + theConfig.readingPageInfoTitle
        + " | Page Count |"
        + NEWLINE + "|-|-|-|-|-|" + NEWLINE;
    const weekEntry = (week) => "| " + [
        urlOf("Week " + week.week, week.weekURL),
        week.weekStartDate,
        week.readingRange,
        week.readingPageInfo,
        week.readingPageCount].join(" | ") + " |";

    const weeksText = theConfig.weeks.sort((a, b) => a.week - b.week)
        .map(weekEntry)
        .join(NEWLINE);
    return headerText + weeksText;
}

function replaceGlobalVariables(theTemplate, theConfig) {
    theTemplate = theTemplate.replace(/\$bookClubName\$/g, theConfig.bookClubName);
    theTemplate = theTemplate.replace(/\$bookClubURL\$/g, urlSnippetOf(theConfig.bookClubURL));
    theTemplate = theTemplate.replace(/\$bookName\$/g, theConfig.bookName);
    theTemplate = theTemplate.replace(/\$bookImage\$/g, theConfig.bookImage);
    theTemplate = theTemplate.replace(/\$bookHomeThreadURL\$/g, urlSnippetOf(theConfig.bookHomeThreadURL));
    theTemplate = theTemplate.replace(/\$whereToBuy\$/g, theConfig.whereToBuy.map(({name, url}) => urlOf(name, url)).join(" | "));
    theTemplate = theTemplate.replace(/\$numberOfTheLastWeek\$/g, theConfig.numberOfTheLastWeek);
    theTemplate = theTemplate.replace(/\$readingPageInfoTitle\$/g, theConfig.readingPageInfoTitle);
    theTemplate = theTemplate.replace(/\$readingRangeTitle\$/g, theConfig.readingRangeTitle);
    theTemplate = theTemplate.replace(/\$weeklyBreakdown\$/g, weeklyBreakdown(theConfig));
    theTemplate = theTemplate.replace(/\$isOnFloFlo\$/g, theConfig.isOnFloFlo);
    theTemplate = theTemplate.replace(/\$hasReadAlongSession\$/g, theConfig.hasReadAlongSession);
    theTemplate = theTemplate.replace(/\$readAlongFirstDate\$/g, theConfig.readAlongFirstDate);
    theTemplate = theTemplate.replace(/\$readAlongWeekday\$/g, theConfig.readAlongWeekday);
    theTemplate = theTemplate.replace(/\$readAlongJSTHuman\$/g, theConfig.readAlongJSTHuman);
    theTemplate = theTemplate.replace(/\$readAlongJSTComputer\$/g, theConfig.readAlongJSTComputer); // TODO
    theTemplate = theTemplate.replace(/\$readingFirstDateWithYear\$/g, theConfig.readingFirstDateWithYear);
    return theTemplate;
}

function replaceWeeklyVariables(theWeekTemplate, theWeekConfig) {
    theWeekTemplate = theWeekTemplate.replace(/\$week\$/g, theWeekConfig.week);
    theWeekTemplate = theWeekTemplate.replace(/\$weekStartDate\$/g, theWeekConfig.weekStartDate || "");
    theWeekTemplate = theWeekTemplate.replace(/\$readingPageInfo\$/g, theWeekConfig.readingPageInfo || "");
    theWeekTemplate = theWeekTemplate.replace(/\$readingEndPercent\$/g, theWeekConfig.readingEndPercent ? theWeekConfig.readingEndPercent + "%" : "");
    theWeekTemplate = theWeekTemplate.replace(/\$readingRange\$/g, theWeekConfig.readingRange || "");
    theWeekTemplate = theWeekTemplate.replace(/\$readingPageCount\$/g, theWeekConfig.readingPageCount || "");
    theWeekTemplate = theWeekTemplate.replace(/\$readAlongNextDate\$/g, theWeekConfig.readAlongNextDate);
    // generated values:
    theWeekTemplate = theWeekTemplate.replace(/\$previousWeek\$/g, theWeekConfig.week - 1);
    theWeekTemplate = theWeekTemplate.replace(/\$nextWeek\$/g, theWeekConfig.week + 1);
    theWeekTemplate = theWeekTemplate.replace(/\$bookPreviousWeekURL\$/g, urlSnippetOf(weeks[theWeekConfig.week - 1] ? weeks[theWeekConfig.week - 1].weekURL : undefined));
    theWeekTemplate = theWeekTemplate.replace(/\$bookNextWeekURL\$/g, urlSnippetOf(weeks[theWeekConfig.week + 1] ? weeks[theWeekConfig.week + 1].weekURL : undefined));
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

const configFileName = process.argv[2];
const config = JSON.parse(fs.readFileSync("./" + configFileName, {encoding: "utf8"}));

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
    homeTemplate = replaceWeeklyVariables(homeTemplate, weeks[nextReadings[0].week]);
}

writeFile("_home.md", homeTemplate);


/////////// generating the weekly threads /////////////////////////////////////////

config.weeks.map(weekConfig => {

    // reload the template for each week!
    var weekTemplate = fs.readFileSync("./" + config.weekTemplate, {encoding: "utf8"});

    weekTemplate = replaceGlobalVariables(weekTemplate, config);
    weekTemplate = replaceWeeklyVariables(weekTemplate, weekConfig);
    weekTemplate = replaceConditionals(weekTemplate);

    writeFile("_week" + weekConfig.week + ".md", weekTemplate);
});
