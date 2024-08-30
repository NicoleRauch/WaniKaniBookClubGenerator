<!-- 
$bookName$ ($bookClubName$ Book Club)

^^^^^^^^^^^^^^^ Use this for the thread title!
-->

[Join the $bookClubName$ Book Club here!]($bookClubURL$) 

## Welcome to $bookName$
$bookImage$

 ## Where to buy 
$whereToBuy$ 

## Discussion Threads and Reading Schedule
::if $hasStarted$
We started reading on $readingFirstDateWithYear$.
::else
We will start reading on $readingFirstDateWithYear$.
::endif

$readingSchedule$

## Spin-Off Club for the Second Part

We decided to continue the book as spin-off club in an informal manner, which means we don't have a fixed schedule, and everybody can read at their own pace. All discussion will take place in this thread. Please note clearly which interview you are referring to in your comments, and make extra sure you use spoiler tags!

For your orientation, here is a list of the interviews and their respective lengths:

| Section                | Page Count |
|------------------------| -: |
| 日比谷線 - 北千住発中目黒行き Intro |5 |
| 1. 平中敦                 |8.5 |
| 2. 市場孝典                |9 |
| 3. 山崎憲一                |16 |
| 4. 牧田晃一郎               |12.5 |
| 5. 吉秋満                 |19 |
| 6. 片山博視                |9 |
| 7. 松本利男                |11 |
| 8. 三上雅之                |4.5 |
| 9. 平山慎子                |15 |
| 10. 時田純夫               |7 |
| 11. 内海哲二               |10 |
| 12. 寺島登                |8 |
| 13. 橋中安治               |8 |
| 14. 奥山正則               |7.5 |
| 15. 玉田道明               |10.5 |
| 16. 長浜弘                |7 |
| 17. 宮崎誠治               |12 |
| 18. 石原孝                |12 |
| 19. 早見利光               |14 |
| 20. 尾形直之               |12.5 |
| 21. 光野充                |14 |
| 22. 片桐武夫               |10 |
| 23. 仲田靖                |10 |
| 24. 伊藤正                |8.5 |
| 25. 安斉邦衛               |6 |
| 26. 初島誠人               |8 |
| 27. 金子晃久               |11 |
| 28. 大沼吉雄               |8 |
| 29. 石倉啓一               |13 |
| 30. 杉本悦子               |10 |
| 31. 和田吉良 / 早苗          |17 |
| 32. 和田嘉子               |27 |
| 目じるしのない悪夢              |0.5 |
| No. 1                  |5.5 |
| No. 2                  |5 |
| No. 3                  |9 |
| No. 4                  |4 |
| No. 5                  |5.5 |
| No. 6                  |7.5 |
| No. 7                  |3 |
| No. 8                  |2 |


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

::if $hasProperNouns$
## Proper Noun Readings
$properNouns$
::endif
