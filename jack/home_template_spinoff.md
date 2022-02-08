<!-- 
$bookName$

^^^^^^^^^^^^^^^ Use this for the thread title!
-->

## Welcome to $bookName$
$bookImage$

This book is Volume 4 of the $bookClubName$ Book Club. [Join the $bookClubName$ Book Club here!]($bookClubURL$)

Despite this book being Vol. 4, it shouldn’t be much of a problem to read it without knowing the other volumes. There seem to be some back references to persons we met in the preceding books but it's probably not too involved. In any case, if you are wondering about anything while reading this book, you are of course free to ask and somebody can fill you in.

 ## Where to buy 
$whereToBuy$ 

## Discussion Threads and Reading Schedule
::if $hasStarted$
We started reading on $readingFirstDateWithYear$.
::else
We will start reading on $readingFirstDateWithYear$.
::endif

$readingSchedule$

::if "$textRatioPerPage$"
(Note: One physical page contains ~$textRatioPerPage$% of the text of one BookWalker "standard page".)

::if "$mainVocabURL$"
## Vocabulary List

$mainVocabURL$
::endif


## Discussion Rules
 * Please use spoiler tags for **_major_** events in the current chapter(s) and **_any_** content in future chapters. 
* When asking for help, please mention the chapter and page number. Also mention what version of the book you are reading. 
* Don't be afraid of asking questions, even if they seem embarrassing at first. All of us are here to learn. 
* To you lurkers out there: Join the conversation, it's fun! 

::if $hasReadAlongSession$
## Read-along Sessions

Come and read from the previous week's section, join in the chat about this book _(also the previous book, possible future books, WK reviews, all things Japan-related, what else you did on the weekend, etc)_ or just lurk and listen.  Readers of all speeds and abilities welcome - we are here to help each other out. Reading sessions will be held every $readAlongWeekday$ at $readAlongJSTHuman$ JST. 

Starting date: One week after we started reading the book, i.e. $readAlongFirstDate$.

Next session (in your timezone): [date=$readAlongNextDate$ time=$readAlongJSTComputer$ format="LLLL \T\Z " timezone="Japan" recurring="1.weeks"]
https://discord.gg/cuV52Bs 
::endif

## Member List

Are you planning to read $bookName$ with the book club?

[poll type=regular results=always public=true]
* Yes
* Yes, but I might start late
* Not sure
* No
[/poll]

If so, which version will you be reading?

[poll name=poll2 type=regular results=always public=true]
* eBook
* Paperback
[/poll]

::if $isOnFloFlo$
## Additional Resources - Vocabulary lists
[FloFlo Word List](https://floflo.moe/books/) (Requires free account)
::endif

## Building Layout

[details="Illustration of the 三ツ星館"]
![image|600x499](upload://6UvbieKrHUZqYSHYd21l2tEhQYY.jpeg)
[/details]

::if $hasProperNouns$
## Proper Noun Readings
$properNouns$
::endif
