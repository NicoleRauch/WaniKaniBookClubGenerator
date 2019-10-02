const fs = require('fs');
const path = require('path');

const urlSnippetOf = (url) => {
    if (!url) {
        return "";
    } // safety measurement: should be caught in template already
    return "https://community.wanikani.com/t/x/" + url.substring(url.lastIndexOf('/') + 1);
};

const configFileName = process.argv[2];
const config = JSON.parse(fs.readFileSync("./" + configFileName, {encoding: "utf8"}));


config.weeks.map(weekConfig => {

    // reload the template for each week!
    var template = fs.readFileSync("./" + config.template, {encoding: "utf8"});
    // Replacements:
    // configured values:
    template = template.replace(/\$bookClubName\$/g, config.bookClubName);
    template = template.replace(/\$bookClubURL\$/g, urlSnippetOf(config.bookClubURL));
    template = template.replace(/\$bookName\$/g, config.bookName);
    template = template.replace(/\$bookImage\$/g, config.bookImage);
    template = template.replace(/\$bookHomeThreadURL\$/g, urlSnippetOf(config.bookHomeThreadURL));
    template = template.replace(/\$numberOfTheLastWeek\$/g, config.numberOfTheLastWeek);
    template = template.replace(/\$isOnFloFlo\$/g, config.isOnFloFlo);
    template = template.replace(/\$hasReadAlongSession\$/g, config.hasReadAlongSession);
    template = template.replace(/\$readAlongWeekday\$/g, config.readAlongWeekday);
    template = template.replace(/\$readAlongJSTHuman\$/g, config.readAlongJSTHuman);
    template = template.replace(/\$readAlongJSTComputer\$/g, config.readAlongJSTComputer); // TODO

    template = template.replace(/\$week\$/g, weekConfig.week);
    template = template.replace(/\$weekStartDate\$/g, weekConfig.weekStartDate);
    template = template.replace(/\$bookPreviousWeekURL\$/g, urlSnippetOf(weekConfig.bookPreviousWeekURL));
    template = template.replace(/\$bookNextWeekURL\$/g, urlSnippetOf(weekConfig.bokNextWeekURL));
    template = template.replace(/\$readingEndPage\$/g, weekConfig.readingEndPage);
    template = template.replace(/\$readingEndPercent\$/g, weekConfig.readingEndPercent);
    template = template.replace(/\$readingEndPhrase\$/g, weekConfig.readingEndPhrase);
    template = template.replace(/\$readingPages\$/g, weekConfig.readingPages);
    template = template.replace(/\$readAlongNextDate\$/g, weekConfig.readAlongNextDate);
    // generated values:
    template = template.replace(/\$previousWeek\$/g, weekConfig.week - 1);
    template = template.replace(/\$nextWeek\$/g, weekConfig.week + 1);

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

    const templateLines = template.split("\n");
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
