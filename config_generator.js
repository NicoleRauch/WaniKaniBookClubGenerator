const fs = require('fs');
const path = require('path');

const weeklyBreakdownFile = process.argv[2];
const tableRows = fs.readFileSync("./" + weeklyBreakdownFile, {encoding: "utf8"}).split("\n").map(x => x.trim());

const configFileName = weeklyBreakdownFile.replace(".md", ".json");
const existingConfig = fs.existsSync(configFileName) ? JSON.parse(fs.readFileSync("./" + configFileName, {encoding: "utf8"})) : {};

const existingWeeksConfig = existingConfig.weeks ?
    existingConfig.weeks.reduce(
        (acc, current) => ({...acc, [current.week]: current}),
        {}
    )
    : {};

const possibleHeaders = [
    "Week",
    "Start Date",
    "End Page",
    "Page Numbers",
    "Pages",
    "Pages (old)",
    "Pages (Collector's)",
    "End Percentage",
    "End Phrase",
    "Chapter",
    "Page Count"
];

const splitRow = row => row.split("|").map(x => x.trim()).filter(x => x);

const columnsFor = (header) => {
    const columnTitles = splitRow(header);
    return columnTitles.reduce(
        (acc, current, index) => {
            switch (current) {
                case "Week": return {...acc, week: index};
                case "Start Date": return {...acc, weekStartDate: index};
                case "End Percentage": return {...acc, readingEndPercent: index};
                case "Page Count": return {...acc, readingPageCount: index};

                case "End Page":
                case "Pages (old)":
                case "Page Numbers": return {...acc, readingPageInfo: index, readingPageInfoTitle: current};

                case "Pages (Collector's)": return {...acc, readingPageInfo2: index, readingPageInfo2Title: current};

                case "End Phrase":
                case "Chapter": return {...acc, readingRange: index, readingRangeTitle: current};
                default:
                    console.log("Unknown column header '" +current+ "' - column will be ignored.");
            }
        },
        {}
    );
};


const isUnderline = str => str.replace(/\|/g, "").replace(/-/g, "").replace(/ /g, "") === "";

if(!isUnderline(tableRows[1])){
    console.log("The table header underline must only contain | - and whitespace");
    console.log("But its second row looks like this:");
    console.log(tableRows[1]);
    process.exit(0);
}

const columns = columnsFor(tableRows[0]);

const tableBody = tableRows.slice(2).filter(x => x.trim()); // only non-empty lines!

const weeksConfig = tableBody.map(row => {
    const fields = splitRow(row);
    let week = parseInt(fields[columns.week].replace("Week ", ""), 10);
    return {
        week,
        weekStartDate: fields[columns.weekStartDate],
        weekURL: existingWeeksConfig[week] ? existingWeeksConfig[week].weekURL || "" : "",
        vocabURL: existingWeeksConfig[week] ? existingWeeksConfig[week].vocabURL || "" : "",
        readingPageInfo: fields[columns.readingPageInfo],
        readingPageInfo2: fields[columns.readingPageInfo2],
        readingEndPercent: parseInt(fields[columns.readingEndPercent], 10),
        readingRange: fields[columns.readingRange],
        readingPageCount: parseFloat(fields[columns.readingPageCount]),
        readAlongNextDate: existingWeeksConfig[week] ? existingWeeksConfig[week].readAlongNextDate || "" : ""
    };
});

const dummyConfig = {
    homeTemplate: "home_template.md",
    weekTemplate: "week_template.md",
    bookClubName: "",
    bookClubURL: "",
    bookName: "",
    bookImage: "",
    bookHomeThreadURL: "",
    whereToBuy: [],
    readingFirstDateWithYear: "",
    readingPageInfoTitle: columns.readingPageInfoTitle,
    readingPageInfo2Title: columns.readingPageInfo2Title,
    readingRangeTitle: columns.readingRangeTitle,
    weeklyBreakdownFile,
    mainVocabUrl: "",
    isOnFloFlo: false,
    hasReadAlongSession: false,
    readAlongFirstDate: "",
    readAlongWeekday: "Sunday",
    readAlongJSTHuman: "9:30pm",
    readAlongJSTComputer: "21:30:00",
};

const fullConfig = {...dummyConfig, ...existingConfig, numberOfTheLastWeek: weeksConfig.length, weeks: weeksConfig};

fs.writeFileSync("./" + configFileName, JSON.stringify(fullConfig, null, 4) + "\n", {encoding: "utf8"});

