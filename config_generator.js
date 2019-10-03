const fs = require('fs');
const path = require('path');

const tableFileName = process.argv[2];
const tableRows = fs.readFileSync("./" + tableFileName, {encoding: "utf8"}).split("\n").map(x => x.trim());

const configFileName = tableFileName.replace(".md", ".json");
const existingConfig = fs.existsSync(configFileName) ? JSON.parse(fs.readFileSync("./" + configFileName, {encoding: "utf8"})) : {};

const existingWeeksConfig = existingConfig.weeks ?
    existingConfig.weeks.reduce(
        (acc, current) => ({...acc, [current.week]: current}),
        {}
    )
    : {};


const isUnderline = str => str.replace(/\|/g, "").replace(/-/g, "").replace(/ /g, "") === "";

if(!isUnderline(tableRows[1])){
    console.log("The table header underline must only contain | - and whitespace");
    console.log("But its second row looks like this:");
    console.log(tableRows[1]);
    process.exit(0);
}

const tableBody = tableRows.slice(2).filter(x => x.trim());

const weeksConfig = tableBody.map(row => {
    const fields = row.split("|");
    let week = parseInt(fields[1].replace("Week ", ""), 10);
    return {
        week,
        weekStartDate: fields[2],
        weekURL: existingWeeksConfig[week] ? existingWeeksConfig[week].weekURL || "" : "",
        readingEndPage: parseInt(fields[3], 10),
        readingEndPercent: parseInt(fields[4], 10),
        readingEndPhrase: fields[5],
        readingPageCount: parseFloat(fields[6]),
        readAlongNextDate: existingWeeksConfig[week] ? existingWeeksConfig[week].readAlongNextDate || "" : ""
    };
});

const dummyConfig = {
    template: "template.md",
    bookClubName: "",
    bookClubURL: "",
    bookName: "",
    bookImage: "",
    bookHomeThreadURL: "",
    isOnFloFlo: false,
    hasReadAlongSession: true,
    readAlongWeekday: "Sunday",
    readAlongJSTHuman: "9:30pm",
    readAlongJSTComputer: "21:30:00",
};

const fullConfig = {...dummyConfig, ...existingConfig, numberOfTheLastWeek: weeksConfig.length, weeks: weeksConfig};

fs.writeFileSync("./" + configFileName, JSON.stringify(fullConfig, null, 4), {encoding: "utf8"});

