const fs = require('fs');
const path = require('path');

const urlSnippetOf = (url) => {
    if(!url) { return ""; } // safety measurement: should be caught in template already
    return "https://community.wanikani.com/t/x/" + url.substring(url.lastIndexOf('/') + 1);
};

const configFileName = process.argv[2];
const config = JSON.parse(fs.readFileSync("./" + configFileName, {encoding: "utf8"}));

var template = fs.readFileSync("./" + config.template, {encoding: "utf8"});

// Replacements:
// configured values:
template = template.replace(/$bookClubName$/g, config.bookClubName);
template = template.replace(/$bookClubURL$/g, urlSnippetOf(config.bookClubURL));
template = template.replace(/$bookName$/g, config.bookName);
template = template.replace(/$bookImage$/g, config.bookImage);
template = template.replace(/$bookHomeThreadURL$/g, urlSnippetOf(config.bookHomeThreadURL));
template = template.replace(/$week$/g, config.week);
template = template.replace(/$weekStartDate$/g, config.weekStartDate);
template = template.replace(/$bookPreviousWeekURL$/g, urlSnippetOf(config.bookPreviousWeekURL));
template = template.replace(/$bookNextWeekURL$/g, urlSnippetOf(config.bokNextWeekURL));
template = template.replace(/$numberOfTheLastWeek$/g, config.numberOfTheLastWeek);
template = template.replace(/$readingEndPage$/g, config.readingEndPage);
template = template.replace(/$readingEndPercent$/g, config.readingEndPercent);
template = template.replace(/$readingEndPhrase$/g, config.readingEndPhrase);
template = template.replace(/$readingPages$/g, config.readingPages);
template = template.replace(/$isOnFloFlo$/g, config.isOnFloFlo);
template = template.replace(/$hasReadAlongSession$/g, config.hasReadAlongSession);
template = template.replace(/$readAlongWeekday$/g, config.readAlongWeekday);
template = template.replace(/$readAlongJSTHuman$/g, config.readAlongJSTHuman);
template = template.replace(/$readAlongJSTComputer$/g, config.readAlongJSTComputer); // TODO
template = template.replace(/$readAlongNextDate$/g, config.readAlongNextDate);
// generated values:
template = template.replace(/$previousWeek$/g, config.week - 1);
template = template.replace(/$nextWeek$/g, config.week + 1);

// conditionals:
// TODO

const resultFileName = configFileName.replace(".json", ".md");
fs.writeFileSync("./" + resultFileName, template, {encoding: "utf8"});

