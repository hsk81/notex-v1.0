===================
|NoTex| Quick Start
===================

|NoTex| is about separating **content** from **presentation**: It is an *editor* that allows you to concentrate on writing your manuscript first and to care about presentation later. During the process of formulating your thoughts, you do not want to get distracted about how things will end up looking on paper or screen. That's something you want to deal later with, *after* you have written your manuscript!

Once you have entered some significant amount of text, you can transform your input into a nice looking PDF or HTML. Since you have separated content from presentation, multiple target formats become feasible and it is easy for |NoTex| to produce the desired PDF or HTML documents.

PDF/HTML translations with multiple languages are not a problem: For example the following glyphs should be rendered in both target formats without any issue: エディタ (Japanese), редактор (Russian), συντάκτης (Greek). With the correct fonts other languages (e.g. Chinese 中) can also be processed.

While you write though, you may want to *emphasize* certain words or thoughts: Just put them between two asterisks ``*``. Emphasizing does not mean to write words in an italic script, since the italic script is just *one* way of expressing emphasis: You could underline them, use another color or just capital letters; it does not matter, since in all cases your one and only intent is *emphasis*. Therefore |NoTex| has one form of a simple emphasis, which is putting the words between asterisks. In the PDF/HTML the emphasized words are indeed put into italics, but that is a presentation issue not a matter of content.

Similarly if you feel that some of your thoughts are **very** important, just use double asterisks ``**``. They will be rendered bold since |NoTex| *defines* that very important elements of a text should be presented boldfaced, but that's again presentation and not content.

This separation of content from presentation w.r.t. simple and strong emphasis may seem minuscule, but if you think about the many elements a standard text is build of then things start to make sense: |NoTex| allows you to express structures like

   table of content, headings, rubrics, paragraphs, simple and strong
   emphasis's, images, tables, lists, quotations, links, mathematical
   expressions, source code, comments, citations, footnotes, indexes,
   glossaries

and many more in a very *natural* and *textual* form. This form or way of writing has a name: **Restructured Text** or simply **RST**. [#f01]_

RST is an easy to read (and to learn!) language, which enables you to write manuscripts in the most obvious way. Plus it maintains the required precision such that a software like |NoTex| is able to convert the manuscript to publication quality PDF or HTML documents.

Each |NoTex| report has at least two documents:

content.txt
   Contains the main corpus of your manuscript; if it's lengthy then you should split it into multiple documents and *content.txt* [#f02]_ should just "collect" these various parts.

and

options.cfg
   Describes how the PDF or HTML exports should *look* like: Novice users should use the default options provided by |NoTex|, but advanced users can study the examples and the wiki [#f03]_ for further details.

As you may have noticed while *content.txt* is about **content**, *options.cfg* is about **presentation**. If all you want to do is to write your manuscript as quickly as possible, then just create a new *report* and start typing in *content.txt*. But if you also wish to control your presentation then you need to edit *options.cfg*.

.. note:: Give it a try and export this quick start - itself an RST document - as a PDF and/or HTML: Press the export button in the *report manager* and the application should offer you a ZIP archive for download. Unpack and investigate the content!

Would you like to provide feedback [#f04]_ or perhaps even participate in the development of |NoTex| then please feel free to visit http://github.com/hsk81/notex.

.. [#f01] `"Restructured Text" <http://sphinx.pocoo.org/rest.html>`_ provides an excellent introduction.

.. [#f02] `content.txt <http://github.com/hsk81/notex/wiki/Configuration-File:-content.txt>`_ explains the main file of a report.

.. [#f03] `options.cfg <http://github.com/hsk81/notex/wiki/Configuration-File:-options.cfg>`_ explains the configuration file.

.. [#f04] See `"Feedback Guidelines" <http://github.com/hsk81/notex/wiki/Feedback-Guidelines>`_ to learn how to give proper feedback.
