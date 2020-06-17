# WaniKani Book Club Generator

This project will allow you to generate the weekly topics for the WaniKani Book Clubs!

## TL;DR

This is a two-phase generator:

Book Breakdown -> Configuration -> Weekly Topics

The configuration is pre-filled from the book club's weekly breakdown. More information needs 
to be added manually to get a good result.

Uses node.js.

## Requirements

You need to install node.js (at least version 8) [which can be downloaded here](https://nodejs.org/en/download/).

## Configuration

### Generating a Configuration Stub
In order to get the result you want, you need to create a configuration file. A stub for this file can be
generated from the WK forum breakdown. Just copy the breakdown table to a `.md` file and run the config generator on it:

```
node config_generator <book_name.md>
```

It will generate a `book_name.json` file that contains all information that can be extracted from the breakdown table.
If you rerun the generator and there is already an edited JSON file in place, the newly generated information will
be merged with the edited data, so nothing should be lost. (We still advise to create a backup copy just in case!)


### Editing the Configuration 
To generate the weekly thread files from the generated JSON file, more information must be specified.
Just fill in the empty strings and adjust any boolean values (for a fully edited file see the provided example file `kitchen.json`).

The configuration file contains the following variables:

|Name|Type|Explanation|
|----|----|-----------|
|`homeTemplate`|String|The name of the template file for the home thread, including file name extension (relative to the current directory)|
|`weekTemplate`|String|The name of the template file for the weekly threads, including file name extension (relative to the current directory)|
|`bookClubName`|String|The name of the book club, e.g. "Beginner"|
|`bookClubURL`|String|The URL of the book club thread (or the last part of the URL)|
|`bookName`|String|The name of the book that this post is for|
|`bookImage`|String|The full image descriptor (you can usually steal this from the book's home thread).|
|`bookHomeThreadURL`|String|The URL of the book's home thread (or the last part of the URL)|
|`whereToBuy`|List of { name, url }|A list of objects containing name and URL of one source of acquisition each.|
|`numberOfTheLastWeek`|Number|The number of the last week for this book (so that the last week does not get a "next week" link).|
|`readingFirstDateWithYear`|When this book's reading will start, as a full date with year (e.g. "October 5th, 2019").|
|`readingPageInfoTitle`|String|The title for the reading page info column (see below), e.g. "Last Page" or "Pages".|
|`readingRangeTitle`|String|The title for the reading range column (see below), e.g. "Chapter" or "End Phrase".|
|`weeklyBreakdownFile`|String|The name of the file that contains the weekly breakdown. If you start out by running the config_generator on the breakdown file, this variable is filled automatically.|
|`isOnFloFlo`|Boolean|Set this to `true` if you want a FloFlo section to be generated, `false` if not.|
|`hasReadAlongSession`|Boolean|Set this to `true` if you want information about a Read-Along session to appear, `false` if not.|
|`readAlongFirstDate`|String; optional|The date of the first reading session, to be announced in the home thread.|
|`readAlongWeekday`|String; optional|The weekday of the read-along session. Only required when the read-along session should be shown.|
|`readAlongJSTHuman`|String; optional|The time of the read-along session in JST, in human-readable format (e.g. `9:30pm`). Only required when the read-along session should be shown.|
|`readAlongJSTComputer`|String; optional|The time of the read-along session in JST, in computer-readable format (e.g. `21:30:00`). Only required when the read-along session should be shown.|
|`weeks`|Array|The list of the configurations for each week (see below).|

The configurations for each week contains the following variables:

|Name|Type|Explanation|
|----|----|-----------|
|`week`|Number|The number of the week that this post is for|
|`weekStartDate`|String|When does this part's reading start, in human-readable format (e.g. "June 3rd")|
|`weekURL`|String; optional|The URL of the week's WK thread (To be added after posting. Initially it can be left out or left empty).|
|`readingPageInfo`|String|Some indication of this week's reading, e.g. the last page or the pages, in the paper book.| 
|`readingEndPercent`|Number|The percentage of the last sentence of this week's reading.| 
|`readingRange`|String|An indicator of what to read, e.g. the chapter or the last phrase of this week's reading.| 
|`readingPageCount`|Number|The number of pages that this week's reading covers.| 
|`readAlongNextDate`|String; optional|The date of the next read-along session, in computer-readable format (e.g. `2019-03-15`). Only required when the read-along session should be shown.|

*Note:* For all URLs, the full forum thread URL or only its last part can be specified. (A robust URL will be generated from either information.)

You also need a template file for the weekly threads (see the provided example file `week_template.md`).

You can use all variable names in the template file, included in `$`, e.g. `$week$`, and
those will get replaced by the values from the configuration file.

### Additional Variables

You can use the following variables in the template file as well, but you need not set them in the configuration
(they will be ignored if you set them there):

|Name|Explanation|
|----|-----------|
|`previousWeek`|The number of the previous week, e.g. for the "previous week" link|
|`nextWeek`|The number of the subsequent week, e.g. for the "next week" link|
|`bookPreviousWeekURL`|The URL of the preceding week|
|`bookNextWeekURL`|The URL of the following week|
|`weeklyBreakdown`|The weekly breakdown that is contained in the weekly breakdown file, enhanced by the links to the weekly threads.|

### Conditional Generation

If you want some part of the template to appear only under certain conditions, you can use the following constructions:

```
::if condition
Text Text Text
::endif
```
If `condition` evaluates to `true` after all variables have been replaced with their configured values,
`Text Text Text` will appear in the template, otherwise not.

```
::if condition
Text Text Text
::else
Other Other Other
::endif
```

If `condition` evaluates to `true` after all variables have been replaced with their configured values,
`Text Text Text` will appear in the template, otherwise `Other Other Other`.

*Note:* This construction cannot be nested.

## Running

### Step 1: Generating the Initial Configuration

In order to generate the initial config file, type

`node config_generator <breakdown.md>`

in the current directory.

If you want to update the initial configuration (e.g. because the breakdown changed) and an edited
config file is already in place, the generator will merge the information so nothing should be lost.

### Step 2: Generating the Home Thread File and the Weekly Thread Files

In order to generate the home thread file and the weekly thread files from the edited config file, type

`node threads_generator <config-file.json>`

in the current directory. It will read the config file and produce a markdown file for the home thread 
as well as for each week.
The markdown files will have the same name, but with the ending `_home.md` and `_weekN.md`, e.g. for the config file `config-file.json` 
you will get `config-file_home.md` and `config-file_week1.md` to `config-file_week123.md` (one for each entry in the `weeks` array).
You can then copy and paste the resulting `.md` files into WaniKani's forum.

If you want to update one of the forum posts at a later stage (e.g. because you now know the next week's URL),
simply update the configuration file with the new information, run the generator again and update the appropriate
forum posts with the result.

## Typical Workflow

A typical workflow goes like this:

1. Publish the Home Thread as initially generated
1. At the start of a new week:
   a. Publish that week's thread as currently generated
   a. Add the week's URL to the JSON config
   a. Regenerate the threads
   a. Publish the newly generated Home Thread
   a. If we're not in week 1: Publish the newly generated previous week's thread
  

## References

* [CommonSpec Markdown Documentation](https://spec.commonmark.org/0.29/)
* Conditional Syntax inspired by https://github.com/andreagentili/markdown-it-condition

