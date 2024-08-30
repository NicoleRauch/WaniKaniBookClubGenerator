<!-- 
$bookName$ ($bookClubName$ Book Club)

^^^^^^^^^^^^^^^ Use this for the thread title!
-->

[Join the $bookClubName$ Book Club here!]($bookClubURL$) 

## Welcome to $bookName$
$bookImage$

 ## Where to buy 
**Japanese**: [Amazon.co.jp](https://www.amazon.co.jp/dp/product/404371002X/ref=as_li_tf_tl) | [BookWalker](https://bookwalker.jp/ded0f105d4-9761-417e-b5b4-b1cdd6426f3f/)
**English**: [Amazon.com](https://www.amazon.com/Aosawa-Murders-Riku-Onda-ebook/dp/B07QN87LQB)

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

## Bilingual Book Club

Some of us had the idea to run an English-Japanese book club, and we decided to have this book club be the first of this kind!

#### What does this mean?

For the Japanese learners, everything stays the same. We will read the book following the schedule as detailed above, and we will ask Japanese language questions and discuss the contents of the book in English, just as with any other book club.
But! The novelty is that some Japanese native speakers who are English learners will also join the club. They will read the book in English, and they will ask English language questions :smiley: The comments and questions can be in Japanese or in English. Please feel free to interact as you see fit :bowing_woman:

日本人の皆様へ：
ようこそ！ :blush: The Aosawa Murdersという英語の本を上記の計画に従って読んでください。言葉や内容について質問があったらぜひ英語でも日本語でも聞いてくださいね。よろしくお願いします！

#### I am (mainly) reading the book in...

[poll name=poll3 type=regular results=always public=true chartType=bar]
* Japanese
* English
  [/poll]

::if $hasProperNouns$
## Proper Noun Readings
$properNouns$
::endif
