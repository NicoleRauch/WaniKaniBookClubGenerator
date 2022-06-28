import * as t from "io-ts";

export enum POSSIBLE_HEADERS {
    week = "Week",
    start_date = "Start Date",
    end_page = "End Page",
    start_page = "Start Page",
    page_numbers = "Page Numbers",
    pages = "Pages",
    pages_old = "Pages (old)",
    pages_collectors = "Pages (Collector's)",
    pages_physical = "Pages (physical)",
    pages_ebook = "Pages (ebook)",
    pages_1951 = "Pages 1951ed.",
    pages_2013 = "Pages 2013ed.",
    end_percentage = "End Percentage",
    kindle_percentage = "Kindle %",
    kindle_loc = "Kindle LOC",
    end_phrase = "End Phrase",
    start_chapter = "Start Chapter",
    end_chapter = "End Chapter",
    chapter = "Chapter",
    chapters = "Chapters",
    chapter_end_phrase = "Chapter / End Phrase",
    chapter_names = "Chapter Names",
    page_count = "Page Count"
}

const IOColumnLayout = t.type({
    week: t.number,
    weekStartDate: t.number,
    readingEndPercent: t.number,
    readingEndPercentTitle: t.string,
    readingPageCount: t.number,
    readingPageInfo: t.number,
    readingPageInfoTitle: t.string,
    readingPageInfo2: t.number,
    readingPageInfo2Title: t.string,
    readingRange: t.number,
    readingRangeTitle: t.string
});

export type IColumnLayout = t.TypeOf<typeof IOColumnLayout>;

const IOProperNoun = t.type({
    name: t.string,
    reading: t.string,
    notes: t.union([t.string, t.undefined]),
    proof: t.union([t.string, t.undefined])
})

export type IProperNoun = t.TypeOf<typeof IOProperNoun>;

const IOWeekConfig = t.type({
    week: t.string,
    weekNumber: t.number,
    weekStartDate: t.union([t.string, t.undefined]),
    weekURL: t.string,
    vocabURL: t.string,
    readingRange: t.string,
    readingPageInfo: t.union([t.string, t.undefined]),
    readingPageInfo2: t.union([t.string, t.undefined]),
    readingEndPercent: t.union([t.number, t.undefined, t.literal("")]),
    readingPageCount: t.union([t.string, t.undefined]),
    readAlongNextDate: t.string,
    properNouns: t.array(IOProperNoun)
});

export type IWeekConfig = t.TypeOf<typeof IOWeekConfig>;

const IOWhereToBuy = t.type({
    name: t.string,
    url: t.union([t.string, t.undefined])
})

export type IWhereToBuy = t.TypeOf<typeof IOWhereToBuy>;

const IONonWeeksConfig = t.type({
    homeTemplate: t.string,
    weekTemplate: t.string,
    bookClubName: t.string,
    bookClubURL: t.string,
    bookName: t.string,
    bookImage: t.string,
    bookHomeThreadURL: t.string,
    whereToBuy: t.array(IOWhereToBuy),
    physicalPageCount: t.string,
    bookwalkerPageCount: t.string,
    readingFirstDateWithYear: t.string,
    readingRangeTitle: t.string,
    readingPageInfoTitle: t.union([t.string, t.undefined]),
    readingPageInfo2Title: t.union([t.string, t.undefined]),
    readingEndPercentTitle: t.union([t.string, t.undefined]),
    linkOnlyOnWeek: t.boolean,
    mainVocabURL: t.string,
    properNouns: t.array(IOProperNoun),
    isOnFloFlo: t.boolean,
    hasReadAlongSession: t.boolean,
    readAlongFirstDate: t.string,
    readAlongWeekday: t.string,
    readAlongJSTHuman: t.string,
    readAlongJSTComputer: t.string,
    showWeekInfo: t.boolean,
    numberOfTheLastWeek: t.number,
});

export type INonWeeksConfig = t.TypeOf<typeof IONonWeeksConfig>;

export const IOConfig = t.intersection([
    IONonWeeksConfig,
    t.type({weeks: t.array(IOWeekConfig) })
]);

export type IConfig = t.TypeOf<typeof IOConfig>;

const IOReading = t.type({
    weekNumber: t.number,
    millisInFuture: t.number
});

export type IReading = t.TypeOf<typeof IOReading>;

const IOCollectedProperNouns = t.type({
    previous: t.array(IOProperNoun),
    current: t.array(IOProperNoun)
});

export type ICollectedProperNouns = t.TypeOf<typeof IOCollectedProperNouns>;
