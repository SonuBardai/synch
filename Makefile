YARN = $(shell which yarn)

install:
	$(YARN)

build:
	$(YARN) build

run:
	$(YARN) dev
