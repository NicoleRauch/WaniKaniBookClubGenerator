const fs = require('fs');
const path = require('path');
const possibleHeaders = require('./general').possibleHeaders;

const log = (text) => { console.log(text); return text; };

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

const splitRow = row => {
    const firstSplit = row.split("|").map(x => x.trim());
    // only throw away empty entries at the start and the end, not in the middle!
    return firstSplit.slice(1, firstSplit.length-1);
};

const columnsFor = (header) => {
    const columnTitles = splitRow(header);
    return columnTitles.reduce(
        (acc, current, index) => {
            switch (current) {
                case possibleHeaders.week: return {...acc, week: index};
                case possibleHeaders.start_date: return {...acc, weekStartDate: index};

                case possibleHeaders.end_percentage:
                case possibleHeaders.kindle_percentage:
                    return {...acc, readingEndPercent: index, readingEndPercentTitle: current};

                case possibleHeaders.page_count: return {...acc, readingPageCount: index};

                case possibleHeaders.pages:
                case possibleHeaders.end_page:
                case possibleHeaders.pages_old:
                case possibleHeaders.page_numbers:
                case possibleHeaders.pages_physical:
                case possibleHeaders.pages_1951:
                    return {...acc, readingPageInfo: index, readingPageInfoTitle: current};

                case possibleHeaders.pages_collectors:
                case possibleHeaders.pages_ebook:
                case possibleHeaders.kindle_loc:
                case possibleHeaders.pages_2013:
                    return {...acc, readingPageInfo2: index, readingPageInfo2Title: current};

                case possibleHeaders.end_phrase:
                case possibleHeaders.start_chapter:
                case possibleHeaders.end_chapter:
                case possibleHeaders.chapter:
                case possibleHeaders.chapter_end_phrase:
                    return {...acc, readingRange: index, readingRangeTitle: current};

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
    console.log("But the file's second row looks like this:");
    console.log(tableRows[1]);
    console.log("Make sure to use a .md file containting the weekly schedule with the config generator.")
    process.exit(0);
}

const trim = e => (e || "").trim();

const columns = columnsFor(tableRows[0]);

const tableBody = tableRows.slice(2).filter(x => x.trim()); // only non-empty lines!

let numberOfTheLastWeek = 0;

const weeksConfig = tableBody.map(row => {
    const fields = splitRow(row);
    const week = parseInt(trim(fields[columns.week]).split(" ").reverse()[0], 10);
    if(week > numberOfTheLastWeek){
        numberOfTheLastWeek = week;
    }
    return {
        week,
        weekStartDate: fields[columns.weekStartDate],
        weekURL: existingWeeksConfig[week] ? existingWeeksConfig[week].weekURL || "" : "",
        vocabURL: existingWeeksConfig[week] ? existingWeeksConfig[week].vocabURL || "" : "",
        readingPageInfo: fields[columns.readingPageInfo],
        readingPageInfo2: fields[columns.readingPageInfo2],
        readingEndPercent: parseInt(fields[columns.readingEndPercent], 10) || "",
        readingRange: fields[columns.readingRange],
        readingPageCount: fields[columns.readingPageCount],
        readAlongNextDate: existingWeeksConfig[week] ? existingWeeksConfig[week].readAlongNextDate || "" : "",
        properNouns: existingWeeksConfig[week] ? existingWeeksConfig[week].properNouns || [] : []
    };
});

const dummyConfig = {
    homeTemplate: "../home_template.md",
    weekTemplate: "../week_template.md",
    bookClubName: "",
    bookClubURL: "",
    bookName: "",
    bookImage: "",
    bookHomeThreadURL: "",
    whereToBuy: [],
    physicalPageCount: "",
    bookwalkerPageCount: "",
    readingFirstDateWithYear: "",
    readingPageInfoTitle: columns.readingPageInfoTitle,
    readingPageInfo2Title: columns.readingPageInfo2Title,
    readingEndPercentTitle: columns.readingEndPercentTitle,
    readingRangeTitle: columns.readingRangeTitle,
    linkOnlyOnWeek: false,
    mainVocabURL: "",
    properNouns: [],
    isOnFloFlo: false,
    hasReadAlongSession: false,
    readAlongFirstDate: "",
    readAlongWeekday: "Sunday",
    readAlongJSTHuman: "9:30pm",
    readAlongJSTComputer: "21:30:00",
    showWeekInfo: true,
};

const fullConfig = {...dummyConfig, ...existingConfig, numberOfTheLastWeek, weeks: weeksConfig};

fs.writeFileSync("./" + configFileName, JSON.stringify(fullConfig, null, 4) + "\n", {encoding: "utf8"});

