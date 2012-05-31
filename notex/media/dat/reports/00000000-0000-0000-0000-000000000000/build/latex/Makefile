ALLDOCS=$(basename $(wildcard *.tex))
ALLPDF=$(addsuffix .pdf,$(ALLDOCS))

TEXEXEC=/usr/bin/xelatex
TEXOPTS=-no-shell-escape -halt-on-error

all: $(ALLPDF)
all-pdf: $(ALLPDF)

%.pdf: %.tex
	${TEXEXEC} $(TEXOPTS) '$<'
	${TEXEXEC} $(TEXOPTS) '$<'
	${TEXEXEC} $(TEXOPTS) '$<'
	-makeindex -s python.ist '$(basename $<).idx'
	${TEXEXEC} $(TEXOPTS) '$<'
	${TEXEXEC} $(TEXOPTS) '$<'

clean:
	rm -f *.dvi *.log *.ind *.aux *.toc *.syn *.idx *.out *.ilg *.pla

.PHONY: all all-pdf clean

