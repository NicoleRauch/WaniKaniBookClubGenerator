const fs = require('fs');
const path = require('path');

const urlSnippetOf = (url) => {
    if (!url) {
        return "";
    } // safety measurement: should be caught in weekTemplate already
    return "https://community.wanikani.com/t/x/" + url.substring(url.lastIndexOf('/') + 1);
};

const configFileName = process.argv[2];
const config = JSON.parse(fs.readFileSync("./" + configFileName, {encoding: "utf8"}));

const weekURLs = config.weeks.reduce(
    (acc, current) => ({...acc, [current.week]: current.weekURL}),
    {}
);

config.weeks.map(weekConfig => {

    // reload the template for each week!
    var weekTemplate = fs.readFileSync("./" + config.weekTemplate, {encoding: "utf8"});
    // Replacements:
    // configured values:
    weekTemplate = weekTemplate.replace(/\$bookClubName\$/g, config.bookClubName);
    weekTemplate = weekTemplate.replace(/\$bookClubURL\$/g, urlSnippetOf(config.bookClubURL));
    weekTemplate = weekTemplate.replace(/\$bookName\$/g, config.bookName);
    weekTemplate = weekTemplate.replace(/\$bookImage\$/g, config.bookImage);
    weekTemplate = weekTemplate.replace(/\$bookHomeThreadURL\$/g, urlSnippetOf(config.bookHomeThreadURL));
    weekTemplate = weekTemplate.replace(/\$numberOfTheLastWeek\$/g, config.numberOfTheLastWeek);
    weekTemplate = weekTemplate.replace(/\$readingPageInfoTitle\$/g, config.readingPageInfoTitle);
    weekTemplate = weekTemplate.replace(/\$readingRangeTitle\$/g, config.readingRangeTitle);
    weekTemplate = weekTemplate.replace(/\$isOnFloFlo\$/g, config.isOnFloFlo);
    weekTemplate = weekTemplate.replace(/\$hasReadAlongSession\$/g, config.hasReadAlongSession);
    weekTemplate = weekTemplate.replace(/\$readAlongWeekday\$/g, config.readAlongWeekday);
    weekTemplate = weekTemplate.replace(/\$readAlongJSTHuman\$/g, config.readAlongJSTHuman);
    weekTemplate = weekTemplate.replace(/\$readAlongJSTComputer\$/g, config.readAlongJSTComputer); // TODO

    weekTemplate = weekTemplate.replace(/\$week\$/g, weekConfig.week);
    weekTemplate = weekTemplate.replace(/\$weekStartDate\$/g, weekConfig.weekStartDate || "");
    weekTemplate = weekTemplate.replace(/\$readingPageInfo\$/g, weekConfig.readingPageInfo || "");
    weekTemplate = weekTemplate.replace(/\$readingEndPercent\$/g, weekConfig.readingEndPercent ? weekConfig.readingEndPercent + "%" : "");
    weekTemplate = weekTemplate.replace(/\$readingRange\$/g, weekConfig.readingRange || "");
    weekTemplate = weekTemplate.replace(/\$readingPageCount\$/g, weekConfig.readingPageCount || "");
    weekTemplate = weekTemplate.replace(/\$readAlongNextDate\$/g, weekConfig.readAlongNextDate);
    // generated values:
    weekTemplate = weekTemplate.replace(/\$previousWeek\$/g, weekConfig.week - 1);
    weekTemplate = weekTemplate.replace(/\$nextWeek\$/g, weekConfig.week + 1);
    weekTemplate = weekTemplate.replace(/\$bookPreviousWeekURL\$/g, urlSnippetOf(weekURLs[weekConfig.week - 1]));
    weekTemplate = weekTemplate.replace(/\$bookNextWeekURL\$/g, urlSnippetOf(weekURLs[weekConfig.week + 1]));

    // conditionals:
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

    const templateLines = weekTemplate.split("\n");
    const result = templateLines.reduce(
        reducer,
        {
            removeLines: false,
            resultLines: []
        }
    );

    const resultFileName = configFileName.replace(".json", "_week" + weekConfig.week + ".md");
    fs.writeFileSync("./" + resultFileName, result.resultLines.join("\n"), {encoding: "utf8"});
});
