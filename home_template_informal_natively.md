<!-- 
$bookName$ (Informal Reading Club)

^^^^^^^^^^^^^^^ Use this for the thread title!
-->

## Welcome to the $bookName$ Informal Reading Club
$bookImage$

 ## Where to buy 
$whereToBuy$ 

## Discussion Threads
::if $hasStarted$
We started reading on $readingFirstDateWithYear$.
::else
We will start reading on $readingFirstDateWithYear$.
::endif

$readingSchedule$

::if "$mainVocabURL$"
## Vocabulary List

$mainVocabURL$
::endif

This is an informal book club, which means you can join any time and read at whatever pace suits you. When you comment, make sure to use spoilers and to always mention up to where you’ve read (and in which book), so that other readers know when it’s safe to open spoilers.

## Discussion Rules
* Please mention which chapter your comment is meant for.
* Please use spoiler tags liberally, both for referring to the book's contents and for speculation of your own.  Label your spoilers accordingly so that people know when it's safe to view them.
* When asking for help, please mention the chapter and page number. Also mention what version of the book you are reading.
* Don't be afraid of asking questions, even if they seem embarrassing at first. All of us are here to learn.
* To you lurkers out there: Join the conversation, it's fun!

## Member List

Are you planning to read $bookName$ with the book club?

[poll type=regular results=always public=true]
* Yes
* Not sure
* I've already read it but I'll join the discussion
* No
[/poll]

If so, which version will you be reading?

[poll name=poll2 type=regular results=always public=true]
* eBook
* Paperback
[/poll]

::if $hasProperNouns$
## Proper Noun Readings
$properNouns$
::endif
