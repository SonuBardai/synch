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
	$(YARN) prisma migrate dev
