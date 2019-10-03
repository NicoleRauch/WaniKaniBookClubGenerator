::if $week$ < $numberOfTheLastWeek$
$bookName$: Week $week$ Discussion
::else
$bookName$: Week $week$ Discussion [END]
::endif

<!-- ^^^^^^^^^^^^^^^ Use this for the thread title! And delete this line :-) -->

[Join the $bookClubName$ Book Club here!]($bookClubURL$) 

[$bookName$ Home Thread]($bookHomeThreadURL$)

## Week $week$
$bookImage$
**Start Date:** $weekStartDate$
::if $week$ > 1 && "$bookPreviousWeekURL$"
**Previous Part:** [Week $previousWeek$]($bookPreviousWeekURL$)
::endif
::if $week$ < $numberOfTheLastWeek$ && "$bookNextWeekURL$"
**Next Part:**  [Week $nextWeek$]($bookNextWeekURL$)
::endif

## Reading:

| $readingPageInfoTitle$ | End % | $readingRangeTitle$ | Page Count |
| --- | --- | --- | --- |
|$readingPageInfo$|$readingEndPercent$|$readingRange$|$readingPageCount$|


::if $isOnFloFlo$
## Word lists - Learn the vocabulary for $bookName$
* [FloFlo Word List](https://floflo.moe/books/) (Requires free account)
::endif

## Discussion Rules

* Please use spoiler tags for  ***major***  events in the current chapter(s) and  ***any***  content in future chapters.
* When asking for help, please mention the chapter and page number. Also mention what version of the book you are reading.
* Don’t be afraid of asking questions, even if they seem embarrassing at first. All of us are here to learn.
* To you lurkers out there: Join the conversation, it’s fun! :durtle:

::if $hasReadAlongSession$
## Read-along Sessions

Come and read from the previous week's section, join in the chat about this book or just lurk and listen.  Readers of all speeds and abilities welcome - we are here to help each other out. Reading sessions will be held every $readAlongWeekday$ at $readAlongJSTHuman$ JST. 

Week $week$ session (in your timezone): [date=$readAlongNextDate$ time=$readAlongJSTComputer$ format="LLLL \T\Z " timezone="Japan" recurring="1.weeks"]
https://discord.gg/cuV52Bs 
::endif

## Participants

Mark your participation status by voting in this poll.

[poll type=regular results=always public=true]
*  I'm reading along
*  I have finished this part
::if $week$ === 1
*  I'm planning to catch up later
::else
*  I'm still reading the book but I haven't reached this part yet
*  I am no longer reading the book
::endif
*  I'm skipping this book
[/poll]
