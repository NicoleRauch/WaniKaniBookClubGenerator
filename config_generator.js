const fs = require('fs');
const path = require('path');

const tableFileName = process.argv[2];
const tableRows = fs.readFileSync("./" + tableFileName, {encoding: "utf8"}).split("\n").map(x => x.trim());

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
    return {
        week: parseInt(fields[1].replace("Week ", ""), 10),
        weekStartDate: fields[2],
        weekURL: "",
        readingEndPage: parseInt(fields[3], 10),
        readingEndPercent: parseInt(fields[4], 10),
        readingEndPhrase: fields[5],
        readingPages: parseFloat(fields[6]),
        readAlongNextDate: ""
    };
});

const fullConfig = {
    template: "template.md",
    bookClubName: "",
    bookClubURL: "",
    bookName: "",
    bookImage: "",
    bookHomeThreadURL: "",
    numberOfTheLastWeek: weeksConfig.length,
    isOnFloFlo: false,
    hasReadAlongSession: true,
    readAlongWeekday: "Sunday",
    readAlongJSTHuman: "9:30pm",
    readAlongJSTComputer: "21:30:00",
    weeks: weeksConfig
};

const resultFileName = tableFileName.replace(".md", ".json");
fs.writeFileSync("./" + resultFileName, JSON.stringify(fullConfig, null, 4), {encoding: "utf8"});

