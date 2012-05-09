=================
Notex' Quickstart
=================

.. hint::

    For a quick demonstration, just click on the *black arrow* next
    to the export button in the report manager's toolbar and select
    ``PDF Report``. This very document will morph auto-magically in
    to a publication like PDF.

When I had to write my thesis I had to choose between *LaTex* [#]_ and *Word*: I did not like LaTex much, because of it's horrible to read markup language. On the other hand using *Word* was for me also not an option, since its output is not comparable to LaTex' in terms of quality. So I ended up using *Open Office*, although it can also not compete with LaTex' publication ready output.

.. [#] http://www.latex-project.org

Later on, I discovered easier to read markup languages like *Markdown* and **Re-Structured Text** aka **RST**. The former is good enough to write comments in blogs or read-me files, but only the latter has the power to translate a complex manuscript into an easy to read and useful digital format. This document itself is written in (or was produced from) RST.

Still, although it is an easy to read markup language, RST alone is not able the produce something even comparable to LaTex' output. You need a piece of software that can take RST and translate it to LaTex: After some time I stumbled upon **Sphinx**, which is exactly doing this translation, thus enabling people to use a markup that feels as natural to write as if you'd be typing on an old fashioned typewriter but still produces publication ready material.

But for many people using Sphinx in combination with LaTex is difficult: You need to install two complex software packages and read manuals to get it to work. This is where *Notex* jumps in: With Notex you do not need to install, configure and maintain anything, but just visit http://blackhan.ch/notex and start writing. That simple.

It takes your RST documents (which are simple text files), put's them through Sphinx, which spits out LaTex, which in turn then is translated to PDF. Sphinx can even produce HTML (and other formats) from the very *same* RST documents: One set of source files, multiple outputs!

There are some disadvantages though: LaTex is compared to RST/Sphinx more mature and offers more configuration possibilities. If you feel, that the standard choices for your LaTex (or other) output are unsatisfactory, you can tweak them to some extent (see http://sphinx.pocoo.org/config.html). But if you want to do fancy stuff, like e.g. arbitrary mixing of one column and two column text, then I'd suggest to use Notex, export the LaTex files and tweak them. This would mean that you've to setup your own LaTex environment.

Like all other systems, there is also some learning curve involved: To tackle it, some people like to read tutorial and references to learn how things work, and others prefer to learn by example. If you're in the former group then check out the links from the list below, and otherwise skip it and read the descriptions of the provided examples:

* `RST primer`_ is an excellent introduction, plus
* you should also become familiar with the additional `Sphinx markup`_ constructs, and
* if you want to tweak your reports' output, then check also the `configuration options`_;

* finally at http://sphinx.pocoo.org/index.html you'll find all of Sphinx' documentation.

.. _RST primer: http://sphinx.pocoo.org/rest.html
.. _Sphinx markup: http://sphinx.pocoo.org/markup/index.html
.. _configuration options: http://sphinx.pocoo.org/config.html

These are the three examples which you can learn from:

1) **Simple Article**

   The *simple article* is just like an essay or a short encyclopedia entry: It does not have a table of contents, no glossary and also no index. Use this one as a guideline, if you're going to write a short to medium length text.

2) **Complex Article**

   If you're going to write a lengthy article (or a small report, semester thesis etc.), but it would still *not* be considered a book, a report, a masters or doctoral thesis, I'd recommend to use the *complex article* example as a template: It starts with a table of contents, has the main corpus immediately following and may have a glossary.

3) **Report**

   A *report* is actually just like a *complex article* in its structure (plus an index at the end), but the final result will resemble a book because the system introduces between the title page, table of contents, main corpus etc. empty pages clearly separating the various parts of a report.

The main differences between the three examples originate from the settings in the *configuration* file (usually *index.cfg*) and to some degree also from the *main* file of the report (usually *index.txt*). If you really want to know how to tweak you report w.r.t. the LaTex/PDF or HTML outputs you should checkout the wiki pages for `index.cfg`_ and `index.txt`_.

.. _index.cfg: https://github.com/hsk81/notex/wiki/Configuration-File:-index.cfg
.. _index.txt: https://github.com/hsk81/notex/wiki/Main-File:-index.txt

I hope you'll enjoy working with Notex and I'm looking forward to your feedback:

* Should you have a *question*, check out the `FAQ`_ first, maybe it has already been addressed. If not then check out `Questions & Answers`_; if you cannot find a relevant question, edit the wiki and enter your own question. Please follow the guidelines and do not enter duplicates.

* Should you think there is a *bug*, again check out the `FAQ`_ and `Questions & Answers`_ pages first; maybe it's just a misunderstanding and the "bug" has already been addressed by somebody else. If not, check out `issues`_ if a similar bug has already been filed; look also at the bug issues that have already been closed. If your bug is still open, don't take any further action or provide additional information (if need be), otherwise simply re-open a closed bug with a relevant comment.

  Only if there is no corresponding (open or closed) bug issue present, then (and only then!) file a new bug report. It should be precise and to the point and enable the developer to *reproduce* the described bug. Don't forget to **label** it as a bug!

* If you've an idea for a new feature, fork the project http://github.com/hsk81/notex, implement it yourself, and send me a pull request. If you're a person without any programming skills, then you may request a feature or post your idea at `Feature Requests`_.

.. _FAQ: http://github.com/hsk81/notex/wiki/FAQ
.. _Questions & Answers: http://github.com/hsk81/notex/wiki/Questions-&-Answers
.. _Feature Requests: http://github.com/hsk81/notex/wiki/Feature-Requests
.. _issues: http://github.com/hsk81/notex/issues