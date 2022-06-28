<!-- 
$bookName$ ($bookClubName$ Book Club)

^^^^^^^^^^^^^^^ Use this for the thread title!
-->

[Join the $bookClubName$ Book Club here!]($bookClubURL$) 

## Welcome to $bookName$
$bookImage$

 ## Where to buy 
$whereToBuy$ 

A big round of applause to @AMomentOfMusic who collected the stories from our schedule [into PDF and Word (docx) documents](https://drive.google.com/drive/folders/1q-cHwWRjS8kQZfvHI_OZJCTvJgab09Sf?usp=sharing).

## Discussion Threads and Reading Schedule
::if $hasStarted$
We started reading on $readingFirstDateWithYear$.
::else
We will start reading on $readingFirstDateWithYear$.
::endif

$readingSchedule$

<sup>1</sup>: Contained in 1951ed. paperback book

<sup>2</sup>: Contained in 2013ed. paperback book

<sup>3</sup>: [Audio recording available](https://librivox.org/author/2924)

### Bonus Weeks

For those of you who would like to finish the Bookwalker ebook, these are the remaining stories. They are not contained in either of the paperback books, but all but one of them are available on Aozora. I will post screenshots of the missing story in its thread.

| Week | Start Date | Chapter | Pages 1951ed. | Pages 2013ed. | Page Count |
| :- | :- | :- | -: | -: | -: |
| Week 14.1 | Nov 27th | 8. [角笛吹く子](https://www.aozora.gr.jp/cards/001475/files/51010_51332.html) |  |  | 7 |
| Week 14.2 | Nov 27th | 11. [酔っぱらい星](https://www.aozora.gr.jp/cards/001475/files/51039_51769.html) |  |  | 8 |
| Week 15.1 | Dec 4th | 12. [木に上った子供](https://www.aozora.gr.jp/cards/001475/files/51051_51582.html) |  |  | 8 |
| Week 15.2 | Dec 4th | 17. 白い馬 |  |  | 4 |
| Week 16 | Dec 11th | 18. [蠟人形](https://www.aozora.gr.jp/cards/001475/files/53168_73203.html) |  |  | 12 |

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
* Paperback (+ maybe some Aozora)
* Aozora only
[/poll]

::if $isOnFloFlo$
## Additional Resources - Vocabulary lists
[FloFlo Word List](https://floflo.moe/books/) (Requires free account)
::endif

::if $hasProperNouns$
## Proper Noun Readings
$properNouns$
::endif
