ALLDOCS = $(basename $(wildcard *.tex))
ALLPDF = $(addsuffix .pdf,$(ALLDOCS))
LATEXOPTS =

all: $(ALLPDF)
all-pdf: $(ALLPDF)

%.pdf: %.tex
	/usr/bin/xelatex $(LATEXOPTS) '$<'
	/usr/bin/xelatex $(LATEXOPTS) '$<'
	/usr/bin/xelatex $(LATEXOPTS) '$<'
	-makeindex -s python.ist '$(basename $<).idx'
	/usr/bin/xelatex $(LATEXOPTS) '$<'
	/usr/bin/xelatex $(LATEXOPTS) '$<'

clean:
	rm -f *.dvi *.log *.ind *.aux *.toc *.syn *.idx *.out *.ilg *.pla

.PHONY: all all-pdf clean

