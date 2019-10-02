const fs = require('fs');
const path = require('path');

const tableFileName = process.argv[2];
const tableRows = fs.readFileSync("./" + tableFileName, {encoding: "utf8"}).split("\n").map(x => x.trim());

const configFileName = tableFileName.replace(".md", ".json");
const existingConfig = fs.existsSync(configFileName) ? JSON.parse(fs.readFileSync("./" + configFileName, {encoding: "utf8"})) : {};

const existingWeeksInfo = existingConfig.weeks ?
    existingConfig.weeks.reduce(
        (acc, current) => ({...acc, [current.week]: current}),
        {}
    )
    : {};

const row1 = "|Week|Start Date|End Page|End Percentage|End Phrase|Pages|";
const row2 = "| --- | --- | --- | --- | --- | --- |";

const isUnderline = str => str.replace(/\|/g, "").replace(/-/g, "").replace(/ /g, "") === "";

if(tableRows[0] !== row1 || !isUnderline(tableRows[1])){
    console.log("The table header must look like this:");
    console.log(row1);
    console.log(row2);
    console.log("But it looks like this:");
    console.log(tableRows[0], "is of the correct shape:", tableRows[0] === row1);
    console.log(tableRows[1], "is of the correct shape:", isUnderline(tableRows[1]));
    process.exit(0);
}

const tableBody = tableRows.slice(2).filter(x => x.trim());

const weeksConfig = tableBody.map(row => {
    const fields = row.split("|");
    let week = parseInt(fields[1].replace("Week ", ""), 10);
    return {
        week,
        weekStartDate: fields[2],
        weekURL: existingWeeksInfo[week] ? existingWeeksInfo[week].weekURL || "" : "",
        readingEndPage: parseInt(fields[3], 10),
        readingEndPercent: parseInt(fields[4], 10),
        readingEndPhrase: fields[5],
        readingPages: parseFloat(fields[6]),
        readAlongNextDate: existingWeeksInfo[week] ? existingWeeksInfo[week].readAlongNextDate || "" : ""
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

