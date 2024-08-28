YARN = $(shell which yarn)

install:
	$(YARN)

build:
	$(YARN) build

run:
	$(YARN) dev

build:
	$(YARN) build

migrate:
	DEBUG="*" $(YARN) prisma migrate dev
